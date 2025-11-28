#!/bin/bash
echo "Sending HARSH TURN status to SafeRide..."
docker exec saferide-mqtt mosquitto_pub -t vehicles/v-101/telemetry -m "{\"vehicle_id\": \"v-101\", \"status\": \"harsh turn\", \"lat\": 28.7041, \"long\": 77.1025, \"confidence\": 0.99, \"source\": \"iot\"}"
echo "Done!"