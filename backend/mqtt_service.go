package main

import (
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/eclipse/paho.mqtt.golang"
	"github.com/go-redis/redis/v8"
	"golang.org/x/net/context"
)

// MQTTService manages MQTT connection and message handling.
type MQTTService struct {
	client            mqtt.Client
	redisClient       *redis.Client
	blockchainService *BlockchainService
	ctx               context.Context
}

// NewMQTTService creates a new MQTTService instance.
func NewMQTTService(broker string, redisClient *redis.Client, blockchainService *BlockchainService, ctx context.Context) *MQTTService {
	opts := mqtt.NewClientOptions().AddBroker(broker).SetClientID("saferide-backend")
	mqtts := &MQTTService{
		redisClient:       redisClient,
		blockchainService: blockchainService,
		ctx:               ctx,
	}
	opts.SetDefaultPublishHandler(mqtts.onMessageReceived()) // Set handler as a method
	client := mqtt.NewClient(opts)
	mqtts.client = client // Assign the created client

	return mqtts
}

// ConnectAndSubscribe connects to the MQTT broker and subscribes to the telemetry topic.
func (s *MQTTService) ConnectAndSubscribe() error {

	if token := s.client.Connect(); token.Wait() && token.Error() != nil {
		return fmt.Errorf("could not connect to MQTT Broker: %v", token.Error())
	}
	log.Println("Successfully connected to MQTT Broker.")

	if token := s.client.Subscribe(mqttTopic, 1, nil); token.Wait() && token.Error() != nil {
		return fmt.Errorf("could not subscribe to topic %s: %v", mqttTopic, token.Error())
	}
	log.Printf("Subscribed to topic: %s", mqttTopic)
	return nil
}

// Disconnect disconnects the MQTT client.
func (s *MQTTService) Disconnect() {
	s.client.Disconnect(250)
	log.Println("MQTT client disconnected.")
}

// onMessageReceived handles incoming MQTT messages.
func (s *MQTTService) onMessageReceived() mqtt.MessageHandler {
	return func(client mqtt.Client, msg mqtt.Message) {
		payload := msg.Payload()

		var data Telemetry
		if err := json.Unmarshal(payload, &data); err != nil {
			log.Printf("Error parsing JSON: %v", err)
			return
		}

		// FORCE Overwrite Timestamp with Server Time (Source of Truth)
		// Pico W has no RTC, so its timestamp is unreliable.
		data.Timestamp = time.Now().Unix()
		
		log.Printf("DEBUG: onMessageReceived for Vehicle: %s, Status: %s at %d", data.VehicleID, data.Status, data.Timestamp)

		// 1. Save Hot State (Latest)
		err := s.redisClient.Set(s.ctx, data.VehicleID, payload, time.Hour).Err()
		if err != nil {
			log.Printf("Failed to save to Redis: %v", err)
			return
		}

		// 2. Save Telemetry History (For Graph)
		historyKey := fmt.Sprintf("history:%s", data.VehicleID)
		s.redisClient.RPush(s.ctx, historyKey, payload)
		s.redisClient.LTrim(s.ctx, historyKey, -50, -1) // Keep last 50 points

		// 3. POINTS SYSTEM (Gamification)
		pointsKey := fmt.Sprintf("points:%s", data.VehicleID)
		safeStreakKey := fmt.Sprintf("safe_streak:%s", data.VehicleID)
		lastIncidentTsKey := fmt.Sprintf("last_incident_timestamp:%s", data.VehicleID)
		lastPeriodicAttestationTsKey := fmt.Sprintf("last_periodic_attestation_timestamp:%s", data.VehicleID)
		lastAlertTsKey := fmt.Sprintf("last_alert_timestamp:%s", data.VehicleID) // Rate Limiter Key


		if data.Status == "safe" {
			// Increment safe streak
			streak, err := s.redisClient.Incr(s.ctx, safeStreakKey).Result()
			if err != nil {
				log.Printf("Failed to increment safe streak: %v", err)
				// Non-fatal error, continue processing
			}

			// Check if streak threshold is reached
			if streak == SAFE_STREAK_THRESHOLD {
				// Award points
				_, err := s.redisClient.IncrBy(s.ctx, pointsKey, POINTS_PER_STREAK).Result()
				if err != nil {
					log.Printf("Failed to award points for safe streak: %v", err)
					// Non-fatal error, continue processing
				}
				log.Printf("🎉 Vehicle %s earned %d points for safe streak! Current total: %s", data.VehicleID, s.redisClient.Get(s.ctx, pointsKey).Val())
				
				// --- NEW: Trigger Solana Safe Attestation (Streak-based) ---
				totalPoints, err := s.redisClient.Get(s.ctx, pointsKey).Int() // Get current total points
				if err != nil {
					log.Printf("Error getting total points for attestation: %v", err)
					totalPoints = 0 // Default to 0 if error
				}
				go s.blockchainService.sendSolanaSafeAttestation(data, POINTS_PER_STREAK, totalPoints)

				// Reset streak for next reward
				s.redisClient.Set(s.ctx, safeStreakKey, 0, 0)
			}

			// --- NEW: Time-based Periodic Safe Attestation Logic ---
			currentTime := time.Now().Unix()
			
			// Get last periodic attestation timestamp
			lastPeriodicAttestationTsStr, err := s.redisClient.Get(s.ctx, lastPeriodicAttestationTsKey).Result()
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
			lastIncidentTsStr, err := s.redisClient.Get(s.ctx, lastIncidentTsKey).Result()
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
				
				go s.blockchainService.sendSolanaPeriodicSafeAttestation(data)
				s.redisClient.Set(s.ctx, lastPeriodicAttestationTsKey, strconv.FormatInt(currentTime, 10), 0) // Store as string
				log.Printf("✅ Periodic safe attestation triggered for %s", data.VehicleID)
			}

		} else { // data.Status is not "safe"
			// Reset safe streak if not safe
			s.redisClient.Set(s.ctx, safeStreakKey, 0, 0)
			// Update last incident timestamp
			s.redisClient.Set(s.ctx, lastIncidentTsKey, strconv.FormatInt(time.Now().Unix(), 10), 0) // Store as string
			// Reset periodic attestation timer if an incident occurs
			s.redisClient.Set(s.ctx, lastPeriodicAttestationTsKey, 0, 0)
		}

		// TRIGGER LOGIC: Any status that is NOT "safe" gets logged to Blockchain
		if data.Status != "safe" {
			// RATE LIMITER: Check if we sent an alert recently
			lastAlertTsStr, err := s.redisClient.Get(s.ctx, lastAlertTsKey).Result()
			var lastAlertTs int64
			if err == nil {
				lastAlertTs, _ = strconv.ParseInt(lastAlertTsStr, 10, 64)
			}

			// Only send if > 5 seconds have passed since last alert
			if time.Now().Unix()-lastAlertTs > 5 {
				log.Printf("⚠️ INCIDENT DETECTED: %s (Vehicle: %s)", data.Status, data.VehicleID)
				go s.blockchainService.sendSolanaAlert(data)
				
				// Update last alert timestamp
				s.redisClient.Set(s.ctx, lastAlertTsKey, strconv.FormatInt(time.Now().Unix(), 10), 0)
			} else {
				log.Printf("⚠️ Rate Limit: Skipping duplicate alert for %s", data.VehicleID)
			}
		}
	}
}
