@echo off
echo Sending SAFE VEHICLE status to SafeRide...
docker exec saferide-mqtt mosquitto_pub -t vehicles/v-101/telemetry -m "{\"vehicle_id\": \"v-101\", \"status\": \"safe_vehicle\", \"lat\": 28.7041, \"long\": 77.1025, \"confidence\": 0.99}"
echo Done! Check your dashboard.
pause
