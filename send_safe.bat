@echo off
echo Sending SAFE status to SafeRide...
docker exec saferide-mqtt mosquitto_pub -t vehicles/v-101/telemetry -m "{\"vehicle_id\": \"v-101\", \"status\": \"safe\", \"lat\": 28.7041, \"long\": 77.1025, \"confidence\": 0.99}"
echo Done! Check your dashboard.
pause
