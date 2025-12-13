import network
import time
import json
import machine
from umqtt.simple import MQTTClient
import sh1106 # This should be sh1106 if 1.2 inch display, snmaller display uses the sh1306 driver
import random

# ==========================================
# 1. CONFIGURATION
# ==========================================
WIFI_SSID = "YOUR-WIFI-NAME(2.4 GHz)"        # <--- Update this!
WIFI_PASSWORD = "YOUR-WIFI-PASSWORD" # <--- Update this!
MQTT_BROKER_IP = "FIND THE IP OF YOUR LAPTOP"      # <--- Update this!

# ==========================================
# 2. HARDWARE SETUP
# ==========================================
# Wires (Back to Safe, Rash, Stress)
btn_safe = machine.Pin(14, machine.Pin.IN, machine.Pin.PULL_UP)
btn_rash = machine.Pin(15, machine.Pin.IN, machine.Pin.PULL_UP)
btn_stress = machine.Pin(16, machine.Pin.IN, machine.Pin.PULL_UP)
btn_heart = machine.Pin(17, machine.Pin.IN, machine.Pin.PULL_UP) # New Heart Rate Wire

# ... (rest of code)



# OLED (SH1106)
i2c = machine.SoftI2C(sda=machine.Pin(0), scl=machine.Pin(1), freq=100000)
oled = sh1106.SH1106_I2C(128, 64, i2c, addr=0x3c)
led = machine.Pin("LED", machine.Pin.OUT)

# ==========================================
# 3. LOGIC
# ==========================================
MQTT_TOPIC = "vehicles/v-101/telemetry"
VEHICLE_ID = "v-101"

def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(WIFI_SSID, WIFI_PASSWORD)
    
    oled.fill(0)
    oled.text("Connecting...", 0, 0)
    oled.text(WIFI_SSID[:16], 0, 15)
    oled.show()

    max_retries = 20
    while not wlan.isconnected() and max_retries > 0:
        led.toggle()
        time.sleep(0.5)
        max_retries -= 1
        
    if wlan.isconnected():
        ip = wlan.ifconfig()[0]
        oled.fill(0)
        oled.text("WiFi Connected!", 0, 0)
        oled.text(ip, 0, 15)
        oled.show()
        time.sleep(1)
        return ip
    return None

# Global State
current_driver_status = "UNKNOWN"
current_vehicle_status = "UNKNOWN"

def draw_dual_status():
    oled.fill(0)
    # Header
    oled.text("SafeRide Monitor", 0, 0)
    oled.hline(0, 10, 128, 1)

    # Driver Status (Top)
    oled.text("DRIVER:", 0, 15)
    oled.text(current_driver_status[:16], 0, 25)

    # Vehicle Status (Bottom)
    oled.text("VEHICLE:", 0, 40)
    oled.text(current_vehicle_status[:16], 0, 50)
    
    oled.show()

def sub_cb(topic, msg):
    global current_driver_status, current_vehicle_status
    try:
        payload = json.loads(msg)
        status = payload.get("status", "unknown").upper()
        
        # Determine type based on status value
        # Driver Statuses
        if status in ["SAFE", "DROWSY", "DISTRACTED", "FATIGUE"]:
            current_driver_status = status
        # Vehicle Statuses
        elif status in ["SAFE_VEHICLE", "HARSH TURN", "HARD BRAKING"]:
            current_vehicle_status = status.replace("SAFE_VEHICLE", "SAFE")
            
        draw_dual_status()
    except Exception as e:
        print(f"Error parsing msg: {e}")

def main():
    try:
        ip = connect_wifi()
        if not ip:
            oled.text("WiFi Failed", 0, 30)
            oled.show()
            return

        client = MQTTClient("pico-w-saferide", MQTT_BROKER_IP, port=1883)
        client.set_callback(sub_cb)
        client.connect()
        client.subscribe(MQTT_TOPIC)
        print(f"Subscribed to {MQTT_TOPIC}")

        # Initial Screen
        draw_dual_status()
        
        last_press = 0
        while True:
            client.check_msg() # Check for incoming messages (non-blocking)
            
            now = time.time()
            status_to_send = None
            
            if btn_safe.value() == 0: status_to_send = "safe_vehicle"
            elif btn_rash.value() == 0: status_to_send = "harsh turn"
            elif btn_stress.value() == 0: status_to_send = "hard braking"
            
            # Heart Rate Logic
            # Wire Connected (LOW) = High BPM (Critical)
            # Wire Disconnected (HIGH) = Normal BPM
            if btn_heart.value() == 0:
                heart_rate = random.randint(125, 145) # Critical
            else:
                heart_rate = random.randint(60, 80) # Normal

            # Determine if we should send data
            should_send = False
            if status_to_send:
                should_send = True
            elif heart_rate > 100: # Critical Heart Rate Trigger
                should_send = True
                status_to_send = "safe_vehicle" # Default status for health alert

            if should_send and (now - last_press > 0.5):
                print(f"Sending: {status_to_send} (HR: {heart_rate})")
                
                # Optimistic UI Update (will be confirmed by MQTT echo)
                global current_vehicle_status
                current_vehicle_status = status_to_send.upper().replace("SAFE_VEHICLE", "SAFE")
                draw_dual_status()
                
                payload = json.dumps({
                    "vehicle_id": VEHICLE_ID,
                    "timestamp": time.time(),
                    "status": status_to_send,
                    "lat": 28.7041,
                    "long": 77.1025,
                    "confidence": 0.99,
                    "heart_rate": heart_rate # Send HR
                })
                client.publish(MQTT_TOPIC, payload)
                last_press = now

            time.sleep(0.05)

    except Exception as e:
        print(f"Critical Error: {e}")
        oled.fill(0)
        oled.text("Error:", 0, 0)
        oled.text(str(e)[:16], 0, 15)
        oled.show()
        machine.reset()

if __name__ == "__main__":
    main()
