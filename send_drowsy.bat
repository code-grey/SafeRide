@echo off
echo Sending DROWSY status to SafeRide...
docker exec saferide-mqtt mosquitto_pub -t vehicles/v-101/telemetry -m "{\"vehicle_id\": \"v-101\", \"status\": \"drowsy\", \"lat\": 28.7041, \"long\": 77.1025, \"confidence\": 0.80}"
echo Done! Check your dashboard.
pause