package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/eclipse/paho.mqtt.golang"
	"github.com/gagliardetto/solana-go"
	"github.com/gagliardetto/solana-go/programs/system"
	"github.com/gagliardetto/solana-go/rpc"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/net/context"
	"strconv"
)

var (
	redisClient  *redis.Client
	mqttClient   mqtt.Client
	solanaClient *rpc.Client
	solanaWallet solana.PrivateKey
	ctx          = context.Background()
)

const (
	mqttTopic = "vehicles/+/telemetry"

	SAFE_STREAK_THRESHOLD = 5
	POINTS_PER_STREAK     = 10
	PERIODIC_SAFE_ATTESTATION_INTERVAL = 30 // seconds
)

// --- Data Structures ---

type Telemetry struct {
	VehicleID  string  `json:"vehicle_id"`
	Timestamp  int64   `json:"timestamp"`
	Status     string  `json:"status"` // "safe", "fatigue", "distracted"
	Lat        float64 `json:"lat"`
	Long       float64 `json:"long"`
	Confidence float64 `json:"confidence"`
	TxHash     string  `json:"tx_hash,omitempty"` // The Solana Proof
}

type User struct {
	Email     string `json:"email"`
	Password  string `json:"password"` // Hashed
	VehicleID string `json:"vehicle_id"`
	Name      string `json:"name"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// --- Blockchain Logic ---

// sendSolanaAlert sends a transaction to the Solana Blockchain.
func sendSolanaAlert(data Telemetry) {
	log.Printf("⛓️ Initiating Solana Transaction for %s [%s]...", data.VehicleID, data.Status)

	// 1. Create the Memo String
	memoText := fmt.Sprintf("SAFERIDE ALERT: %s | ID: %s | TIME: %d | CONF: %.2f", 
		data.Status, data.VehicleID, data.Timestamp, data.Confidence)
	log.Printf("📝 Memo: %s", memoText)

	// 2. Build Instructions
	memoProgramID := solana.MustPublicKeyFromBase58("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")
	memoInstr := solana.NewInstruction(
		memoProgramID,
		solana.AccountMetaSlice{
			solana.Meta(solanaWallet.PublicKey()).SIGNER(),
		}, 
		[]byte(memoText),
	)

	transferInstr := system.NewTransferInstruction(
		0, 
		solanaWallet.PublicKey(), 
		solanaWallet.PublicKey(), 
	).Build()

	recent, err := solanaClient.GetLatestBlockhash(context.TODO(), rpc.CommitmentFinalized)
	if err != nil {
		log.Printf("❌ Solana Error (GetBlockhash): %v", err)
		return
	}

	// Combine both instructions
	tx, err := solana.NewTransaction(
		[]solana.Instruction{memoInstr, transferInstr},
		recent.Value.Blockhash,
		solana.TransactionPayer(solanaWallet.PublicKey()),
	)
	if err != nil {
		log.Printf("❌ Solana Error (BuildTx): %v", err)
		return
	}

	// 3. Sign Transaction
	_, err = tx.Sign(
		func(key solana.PublicKey) *solana.PrivateKey {
			if solanaWallet.PublicKey().Equals(key) {
				return &solanaWallet
			}
			return nil
		},
	)
	if err != nil {
		log.Printf("❌ Solana Error (Sign): %v", err)
		return
	}

	// 4. Send Transaction
	sig, err := solanaClient.SendTransactionWithOpts(
		context.TODO(),
		tx,
		rpc.TransactionOpts{
			SkipPreflight:       false,
			PreflightCommitment: rpc.CommitmentFinalized,
		},
	)
	if err != nil {
		log.Printf("❌ Solana Error (Send): %v", err)
		return
	}

	log.Printf("✅ Solana Logged: [%s] Signature: %s", data.Status, sig)

	// 5. Update Redis with the Hash
	data.TxHash = sig.String()
	updatedJSON, _ := json.Marshal(data)
	
	// A. Update Hot State
	err = redisClient.Set(ctx, data.VehicleID, updatedJSON, time.Hour).Err()
	if err != nil {
		log.Printf("Failed to update Redis with Hash: %v", err)
	}

	// B. Add to Alerts History (Only Incidents with Hashes go here)
	alertKey := fmt.Sprintf("alerts:%s", data.VehicleID)
	redisClient.RPush(ctx, alertKey, updatedJSON)
	redisClient.LTrim(ctx, alertKey, -20, -1) // Keep last 20 alerts
}

// sendSolanaSafeAttestation sends a transaction to the Solana Blockchain for safe driving attestation.
// It accepts a Telemetry object which it will update with TxHash and a specific Status.
func sendSolanaSafeAttestation(data Telemetry, pointsAwarded, totalPoints int) {
	log.Printf("⛓️ Initiating Solana Safe Attestation for %s (Points Awarded: %d)", data.VehicleID, pointsAwarded)

	// 1. Create the Memo String
	memoText := fmt.Sprintf("SAFERIDE ATTESTATION: %s earned %d points. Total: %d.",
		data.VehicleID, pointsAwarded, totalPoints)
	log.Printf("📝 Memo: %s", memoText)

	memoProgramID := solana.MustPublicKeyFromBase58("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")
	memoInstr := solana.NewInstruction(
		memoProgramID,
		solana.AccountMetaSlice{
			solana.Meta(solanaWallet.PublicKey()).SIGNER(),
		},
		[]byte(memoText),
	)

	transferInstr := system.NewTransferInstruction(
		0,
		solanaWallet.PublicKey(),
		solanaWallet.PublicKey(),
	).Build()

	recent, err := solanaClient.GetLatestBlockhash(context.TODO(), rpc.CommitmentFinalized)
	if err != nil {
		log.Printf("❌ Solana Error (GetBlockhash for Attestation): %v", err)
		return
	}

	tx, err := solana.NewTransaction(
		[]solana.Instruction{memoInstr, transferInstr},
		recent.Value.Blockhash,
		solana.TransactionPayer(solanaWallet.PublicKey()),
	)
	if err != nil {
		log.Printf("❌ Solana Error (BuildTx for Attestation): %v", err)
		return
	}

	_, err = tx.Sign(
		func(key solana.PublicKey) *solana.PrivateKey {
			if solanaWallet.PublicKey().Equals(key) {
				return &solanaWallet
			}
			return nil
		},
	)
	if err != nil {
		log.Printf("❌ Solana Error (Sign for Attestation): %v", err)
		return
	}

	sig, err := solanaClient.SendTransactionWithOpts(
		context.TODO(),
		tx,
		rpc.TransactionOpts{
			SkipPreflight:       false,
			PreflightCommitment: rpc.CommitmentFinalized,
		},
	)
	if err != nil {
		log.Printf("❌ Solana Error (Send for Attestation): %v", err)
		return
	}

	sigStr := sig.String()
	log.Printf("✅ Solana Safe Attestation Logged! Signature: %s", sigStr)

	// 5. Update Telemetry data with hash and specific status, then push to Redis alerts list
	data.TxHash = sigStr
	data.Status = "SAFE_STREAK_ATTESTATION" // New status for frontend
	updatedJSON, _ := json.Marshal(data)
	
	alertKey := fmt.Sprintf("alerts:%s", data.VehicleID)
	redisClient.RPush(ctx, alertKey, updatedJSON)
	redisClient.LTrim(ctx, alertKey, -20, -1) // Keep last 20 alerts
}

// sendSolanaPeriodicSafeAttestation sends a transaction to the Solana Blockchain for periodic safe driving attestation.
// It accepts a Telemetry object which it will update with TxHash and a specific Status.
func sendSolanaPeriodicSafeAttestation(data Telemetry) {
	log.Printf("⛓️ Initiating Solana Periodic Safe Attestation for %s [%s]...", data.VehicleID, data.Status)

	// 1. Create the Memo String
	memoText := fmt.Sprintf("SAFERIDE PERIODIC ATTESTATION: %s status: %s", data.VehicleID, data.Status)
	log.Printf("📝 Memo: %s", memoText)

	memoProgramID := solana.MustPublicKeyFromBase58("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")
	memoInstr := solana.NewInstruction(
		memoProgramID,
		solana.AccountMetaSlice{
			solana.Meta(solanaWallet.PublicKey()).SIGNER(),
		},
		[]byte(memoText),
	)

	transferInstr := system.NewTransferInstruction(
		0,
		solanaWallet.PublicKey(),
		solanaWallet.PublicKey(),
	).Build()

	recent, err := solanaClient.GetLatestBlockhash(context.TODO(), rpc.CommitmentFinalized)
	if err != nil {
		log.Printf("❌ Solana Error (GetBlockhash for Periodic Attestation): %v", err)
		return
	}

	tx, err := solana.NewTransaction(
		[]solana.Instruction{memoInstr, transferInstr},
		recent.Value.Blockhash,
		solana.TransactionPayer(solanaWallet.PublicKey()),
	)
	if err != nil {
		log.Printf("❌ Solana Error (BuildTx for Periodic Attestation): %v", err)
		return
	}

	_, err = tx.Sign(
		func(key solana.PublicKey) *solana.PrivateKey {
			if solanaWallet.PublicKey().Equals(key) {
				return &solanaWallet
			}
			return nil
		},
	)
	if err != nil {
		log.Printf("❌ Solana Error (Sign for Periodic Attestation): %v", err)
		return
	}

	sig, err := solanaClient.SendTransactionWithOpts(
		context.TODO(),
		tx,
		rpc.TransactionOpts{
			SkipPreflight:       false,
			PreflightCommitment: rpc.CommitmentFinalized,
		},
	)
	if err != nil {
		log.Printf("❌ Solana Error (Send for Periodic Attestation): %v", err)
		return
	}

	sigStr := sig.String()
	log.Printf("✅ Solana Periodic Safe Attestation Logged! Signature: %s", sigStr)

	// 5. Update Telemetry data with hash and specific status, then push to Redis alerts list
	data.TxHash = sigStr
	data.Status = "PERIODIC_SAFE_ATTESTATION" // New status for frontend
	updatedJSON, _ := json.Marshal(data)
	
	alertKey := fmt.Sprintf("alerts:%s", data.VehicleID)
	redisClient.RPush(ctx, alertKey, updatedJSON)
	redisClient.LTrim(ctx, alertKey, -20, -1) // Keep last 20 alerts
}

// --- MQTT Logic ---

// onMessageReceived handles incoming MQTT messages.
var onMessageReceived mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	payload := msg.Payload()

	var data Telemetry
	if err := json.Unmarshal(payload, &data); err != nil {
		log.Printf("Error parsing JSON: %v", err)
		return
	}

	// Ensure Telemetry.Timestamp is real-time if not provided by IoT or is 0
	if data.Timestamp == 0 {
		data.Timestamp = time.Now().Unix()
	}

	// 1. Save Hot State (Latest)
	err := redisClient.Set(ctx, data.VehicleID, payload, time.Hour).Err()
	if err != nil {
		log.Printf("Failed to save to Redis: %v", err)
		return
	}

	// 2. Save Telemetry History (For Graph)
	historyKey := fmt.Sprintf("history:%s", data.VehicleID)
	redisClient.RPush(ctx, historyKey, payload)
	redisClient.LTrim(ctx, historyKey, -50, -1) // Keep last 50 points

	// 3. POINTS SYSTEM (Gamification)
	pointsKey := fmt.Sprintf("points:%s", data.VehicleID)
	safeStreakKey := fmt.Sprintf("safe_streak:%s", data.VehicleID)
	lastIncidentTsKey := fmt.Sprintf("last_incident_timestamp:%s", data.VehicleID)
	lastPeriodicAttestationTsKey := fmt.Sprintf("last_periodic_attestation_timestamp:%s", data.VehicleID)


	if data.Status == "safe" {
		// Increment safe streak
		streak, err := redisClient.Incr(ctx, safeStreakKey).Result()
		if err != nil {
			log.Printf("Failed to increment safe streak: %v", err)
			// Non-fatal error, continue processing
		}

		// Check if streak threshold is reached
		if streak == SAFE_STREAK_THRESHOLD {
			// Award points
			_, err := redisClient.IncrBy(ctx, pointsKey, POINTS_PER_STREAK).Result()
			if err != nil {
				log.Printf("Failed to award points for safe streak: %v", err)
				// Non-fatal error, continue processing
			}
			log.Printf("🎉 Vehicle %s earned %d points for safe streak! Current total: %s", data.VehicleID, redisClient.Get(ctx, pointsKey).Val())
			
			// --- NEW: Trigger Solana Safe Attestation (Streak-based) ---
			totalPoints, err := redisClient.Get(ctx, pointsKey).Int() // Get current total points
			if err != nil {
				log.Printf("Error getting total points for attestation: %v", err)
				totalPoints = 0 // Default to 0 if error
			}
			go sendSolanaSafeAttestation(data, POINTS_PER_STREAK, totalPoints)

			// Reset streak for next reward
			redisClient.Set(ctx, safeStreakKey, 0, 0) 
		}

		// --- NEW: Time-based Periodic Safe Attestation Logic ---
		currentTime := time.Now().Unix()
		
		// Get last periodic attestation timestamp
		lastPeriodicAttestationTsStr, err := redisClient.Get(ctx, lastPeriodicAttestationTsKey).Result()
		var lastPeriodicAttestationTs int64
		if err == redis.Nil {
			lastPeriodicAttestationTs = 0 // Never attested
		} else if err != nil {
			log.Printf("Error getting last periodic attestation timestamp: %v", err)
			lastPeriodicAttestationTs = 0
		} else {
			lastPeriodicAttestationTs, _ = strconv.ParseInt(lastPeriodicAttestationTsStr, 10, 64)
		}

		// Get last incident timestamp
		lastIncidentTsStr, err := redisClient.Get(ctx, lastIncidentTsKey).Result()
		var lastIncidentTs int64
		if err == redis.Nil {
			lastIncidentTs = 0 // No incident ever recorded for this vehicle
		} else if err != nil {
			log.Printf("Error getting last incident timestamp: %v", err)
			lastIncidentTs = 0
		} else {
			lastIncidentTs, _ = strconv.ParseInt(lastIncidentTsStr, 10, 64)
		}

		// Check conditions for periodic attestation
		if (currentTime - lastPeriodicAttestationTs >= PERIODIC_SAFE_ATTESTATION_INTERVAL) &&
		   (currentTime - lastIncidentTs >= PERIODIC_SAFE_ATTESTATION_INTERVAL || lastIncidentTs == 0) {
			
			go sendSolanaPeriodicSafeAttestation(data)
			redisClient.Set(ctx, lastPeriodicAttestationTsKey, strconv.FormatInt(currentTime, 10), 0) // Store as string
			log.Printf("✅ Periodic safe attestation triggered for %s", data.VehicleID)
		}

	} else { // data.Status is not "safe"
		// Reset safe streak if not safe
		redisClient.Set(ctx, safeStreakKey, 0, 0)
		// Update last incident timestamp
		redisClient.Set(ctx, lastIncidentTsKey, strconv.FormatInt(time.Now().Unix(), 10), 0) // Store as string
		// Reset periodic attestation timer if an incident occurs
		redisClient.Set(ctx, lastPeriodicAttestationTsKey, 0, 0)
	}

	// TRIGGER LOGIC: Any status that is NOT "safe" gets logged to Blockchain
	if data.Status != "safe" {
		log.Printf("⚠️ INCIDENT DETECTED: %s (Vehicle: %s)", data.Status, data.VehicleID)
		go sendSolanaAlert(data)
	}
}

// --- Main ---

func main() {
	// --- Environment Variables ---
	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		redisAddr = "localhost:6379"
	}

	mqttBroker := os.Getenv("MQTT_BROKER")
	if mqttBroker == "" {
		mqttBroker = "tcp://localhost:1883"
	}

	log.Println("SafeRide Backend v4.0 (Auth + Gamification)")

	// --- Load Solana Wallet ---
	walletFile, err := os.ReadFile("solana-wallet.json")
	if err != nil {
		log.Fatalf("❌ FATAL: Could not find 'solana-wallet.json'. Run keygen first.")
	}
	var privKeyBytes []byte
	if err := json.Unmarshal(walletFile, &privKeyBytes); err != nil {
		log.Fatalf("❌ FATAL: Invalid wallet file format: %v", err)
	}
	solanaWallet = solana.PrivateKey(privKeyBytes)
	log.Printf("🔑 Loaded Solana Wallet: %s", solanaWallet.PublicKey())

	// --- Init Solana Client ---
	solanaClient = rpc.New(rpc.DevNet_RPC)

	// --- Redis Connection ---
	redisClient = redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})
	_, err = redisClient.Ping(ctx).Result()
	if err != nil {
		log.Fatalf("Could not connect to Redis: %v", err)
	}
	log.Println("Successfully connected to Redis.")

	// --- MQTT Connection ---
	opts := mqtt.NewClientOptions().AddBroker(mqttBroker).SetClientID("saferide-backend")
	opts.SetDefaultPublishHandler(onMessageReceived)

	mqttClient = mqtt.NewClient(opts)
	if token := mqttClient.Connect(); token.Wait() && token.Error() != nil {
		log.Fatalf("Could not connect to MQTT Broker: %v", token.Error())
	}
	log.Println("Successfully connected to MQTT Broker.")

	if token := mqttClient.Subscribe(mqttTopic, 1, nil); token.Wait() && token.Error() != nil {
		log.Fatalf("Could not subscribe to topic %s: %v", mqttTopic, token.Error())
	}
	log.Printf("Subscribed to topic: %s", mqttTopic)

	// --- Gin Web Server ---
	router := gin.Default()

	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// --- Auth Routes ---

	router.POST("/api/signup", func(c *gin.Context) {
		var newUser User
		if err := c.ShouldBindJSON(&newUser); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		// Hash Password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to hash password"})
			return
		}
		newUser.Password = string(hashedPassword)

		// Store in Redis: user:{email}
		userData, _ := json.Marshal(newUser)
		err = redisClient.Set(ctx, "user:"+newUser.Email, userData, 0).Err() // 0 = No expiration
		if err != nil {
			c.JSON(500, gin.H{"error": "Database error"})
			return
		}

		c.JSON(201, gin.H{"message": "User created", "vehicle_id": newUser.VehicleID})
	})

	router.POST("/api/login", func(c *gin.Context) {
		var creds LoginRequest
		if err := c.ShouldBindJSON(&creds); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		// Fetch User
		val, err := redisClient.Get(ctx, "user:"+creds.Email).Result()
		if err == redis.Nil {
			c.JSON(401, gin.H{"error": "Invalid credentials"})
			return
		} else if err != nil {
			c.JSON(500, gin.H{"error": "Database error"})
			return
		}

		var storedUser User
		json.Unmarshal([]byte(val), &storedUser)

		// Check Password
		err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(creds.Password))
		if err != nil {
			c.JSON(401, gin.H{"error": "Invalid credentials"})
			return
		}

		// Return Success (In prod, return JWT. Here, simple user info)
		c.JSON(200, gin.H{
			"message": "Login successful", 
			"vehicle_id": storedUser.VehicleID,
			"name": storedUser.Name,
			"email": storedUser.Email,
		})
	})

	// --- Core API ---

	router.GET("/api/status/:vehicle_id", func(c *gin.Context) {
		vehicleID := c.Param("vehicle_id")
		val, err := redisClient.Get(ctx, vehicleID).Result()
		if err == redis.Nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Vehicle not found"})
			return
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Redis error"})
			return
		}
		c.Header("Content-Type", "application/json")
		c.String(http.StatusOK, val)
	})

	router.GET("/api/history/:vehicle_id", func(c *gin.Context) {
		vehicleID := c.Param("vehicle_id")
		key := fmt.Sprintf("history:%s", vehicleID)
		vals, err := redisClient.LRange(ctx, key, 0, -1).Result()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Redis error"})
			return
		}
		jsonArray := "["
		for i, v := range vals {
			if i > 0 { jsonArray += "," }
			jsonArray += v
		}
		jsonArray += "]"
		c.Header("Content-Type", "application/json")
		c.String(http.StatusOK, jsonArray)
	})

	router.GET("/api/alerts/:vehicle_id", func(c *gin.Context) {
		vehicleID := c.Param("vehicle_id")
		key := fmt.Sprintf("alerts:%s", vehicleID)
		vals, err := redisClient.LRange(ctx, key, 0, -1).Result()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Redis error"})
			return
		}
		jsonArray := "["
		for i, v := range vals {
			if i > 0 { jsonArray += "," }
			jsonArray += v
		}
		jsonArray += "]"
		c.Header("Content-Type", "application/json")
		c.String(http.StatusOK, jsonArray)
	})

	// --- Gamification API ---

	router.GET("/api/points/:vehicle_id", func(c *gin.Context) {
		vehicleID := c.Param("vehicle_id")
		key := fmt.Sprintf("points:%s", vehicleID)
		
		pointsStr, err := redisClient.Get(ctx, key).Result()
		if err == redis.Nil {
			// No points yet, return 0
			c.JSON(200, gin.H{"vehicle_id": vehicleID, "points": 0})
			return
		} else if err != nil {
			c.JSON(500, gin.H{"error": "Redis error"})
			return
		}
		
		c.Header("Content-Type", "application/json")
		c.JSON(200, gin.H{"vehicle_id": vehicleID, "points": pointsStr}) // pointsStr is string representation of int
	})

	go func() {
		if err := router.Run(":8080"); err != nil {
			log.Fatalf("Gin server failed to run: %v", err)
		}
	}()
	log.Println("Gin server started on port 8080.")

	// --- Graceful Shutdown ---
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down...")

	mqttClient.Disconnect(250)
	log.Println("MQTT client disconnected.")
}
