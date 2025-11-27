#!/bin/bash
echo "Sending RASH DRIVING status to SafeRide..."
docker exec saferide-mqtt mosquitto_pub -t vehicles/v-101/telemetry -m "{\"vehicle_id\": \"v-101\", \"status\": \"rash driving\", \"lat\": 28.7041, \"long\": 77.1025, \"confidence\": 0.95}"
echo "Done!"
