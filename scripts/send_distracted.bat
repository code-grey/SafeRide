@echo off
echo Sending DISTRACTED status to SafeRide...
docker exec saferide-mqtt mosquitto_pub -t vehicles/v-101/telemetry -m "{\"vehicle_id\": \"v-101\", \"status\": \"distracted\", \"lat\": 28.7041, \"long\": 77.1025, \"confidence\": 0.85}"
echo Done! Check your dashboard.
pause
