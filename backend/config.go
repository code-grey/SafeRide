package main

const (
	mqttTopic = "vehicles/+/telemetry"

	SAFE_STREAK_THRESHOLD              = 15
	POINTS_PER_STREAK                  = 10
	PERIODIC_SAFE_ATTESTATION_INTERVAL = 30 // seconds
)
