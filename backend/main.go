package main

import (
	"encoding/json" // Still used by wallet unmarshal
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gagliardetto/solana-go"
	"github.com/gagliardetto/solana-go/rpc"
	"github.com/gin-gonic/gin"
	"golang.org/x/net/context"
)

var (
	blockchainService *BlockchainService // Global for blockchain service
	mqttService       *MQTTService       // Global for MQTT service
	redisService      *RedisService      // Global for Redis service
	ctx          = context.Background()
)	
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
	solanaWallet := solana.PrivateKey(privKeyBytes)
	log.Printf("🔑 Loaded Solana Wallet: %s", solanaWallet.PublicKey())

	// --- Init Solana Client ---
	solanaClient := rpc.New(rpc.DevNet_RPC)

	// --- Redis Connection ---
	redisService, err = NewRedisService(redisAddr, ctx)
	if err != nil {
		log.Fatalf("❌ FATAL: %v", err)
	}

	// --- Init Blockchain Service ---
	blockchainService = NewBlockchainService(solanaClient, solanaWallet, redisService.Client(), redisService.Context())

	// --- Init MQTT Service ---
	mqttService = NewMQTTService(mqttBroker, redisService.Client(), blockchainService, redisService.Context())
	if err := mqttService.ConnectAndSubscribe(); err != nil {
		log.Fatalf("Could not connect to MQTT Broker: %v", err)
	}

	log.Println("Successfully connected to MQTT Broker.")

	// --- Gin Web Server ---
	router := gin.Default()
	SetupRoutes(router, redisService.Client(), ctx) // Pass redisService.Client() and ctx
	
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

	mqttService.Disconnect()
	log.Println("MQTT client disconnected.")
}