import network
import time
import json
import machine
from umqtt.simple import MQTTClient

# ==========================================
# 1. CONFIGURATION (EDIT THIS SECTION)
# ==========================================
WIFI_SSID = "YOUR_WIFI_NAME"       # <--- Enter your Wi-Fi Name
WIFI_PASSWORD = "YOUR_WIFI_PASSWORD" # <--- Enter your Wi-Fi Password

# Run 'ipconfig' on your laptop to find this. 
# Look for "IPv4 Address" (e.g., 192.168.1.5)
MQTT_BROKER_IP = "192.168.X.X"     # <--- Enter your Laptop's IP

import network
import time
import json
import machine
from umqtt.simple import MQTTClient
import ssd1306

# ==========================================
# 1. CONFIGURATION (EDIT THIS SECTION)
# ==========================================
WIFI_SSID = "YOUR_WIFI_NAME"
WIFI_PASSWORD = "YOUR_WIFI_PASSWORD"
MQTT_BROKER_IP = "192.168.X.X" # <--- Run 'ipconfig' to check

# ==========================================
# 2. HARDWARE SETUP
# ==========================================
# Button: GP14 (Pin 19) -> GND
BTN_PIN = 14 
btn = machine.Pin(BTN_PIN, machine.Pin.IN, machine.Pin.PULL_UP)

# OLED: I2C0, SDA=GP0, SCL=GP1
i2c = machine.I2C(0, sda=machine.Pin(0), scl=machine.Pin(1), freq=400000)
oled = ssd1306.SSD1306_I2C(128, 64, i2c)

# Internal LED
led = machine.Pin("LED", machine.Pin.OUT)

# ==========================================
# 3. SYSTEM CONSTANTS
# ==========================================
MQTT_PORT = 1883
MQTT_CLIENT_ID = "pico-w-saferide"
MQTT_TOPIC = "vehicles/v-101/telemetry"
VEHICLE_ID = "v-101"
LAT, LONG = 28.7041, 77.1025

# State Machine
STATES = ["safe", "distracted", "fatigue"]
current_state_idx = 0 

def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(WIFI_SSID, WIFI_PASSWORD)
    
    oled.fill(0)
    oled.text("Connecting to", 0, 0)
    oled.text(WIFI_SSID, 0, 10)
    oled.show()
    print(f"Connecting to {WIFI_SSID}...")

    max_retries = 20
    while not wlan.isconnected() and max_retries > 0:
        led.toggle()
        time.sleep(0.5)
        max_retries -= 1
        
    if wlan.isconnected():
        led.on()
        ip = wlan.ifconfig()[0]
        print(f"Connected! IP: {ip}")
        oled.fill(0)
        oled.text("Wi-Fi Connected", 0, 0)
        oled.text(ip, 0, 10)
        oled.show()
        time.sleep(2)
        return ip
    else:
        oled.fill(0)
        oled.text("Wi-Fi Failed", 0, 0)
        oled.show()
        return None

def update_display(status, ip):
    oled.fill(0)
    oled.text("SafeRide IoT", 0, 0)
    oled.text(f"IP: {ip}", 0, 10)
    
    oled.text("STATUS:", 0, 30)
    
    # Large text simulation (Double spacing)
    status_u = status.upper()
    oled.text(status_u, 0, 45)
    
    # Add some graphics based on state
    if status == "safe":
        oled.rect(90, 30, 30, 30, 1) # Box
    elif status == "distracted":
        oled.line(90, 30, 120, 60, 1) # X
        oled.line(120, 30, 90, 60, 1)
    elif status == "fatigue":
        oled.fill_rect(90, 30, 30, 30, 1) # Solid Block

    oled.show()

def main():
    global current_state_idx
    try:
        ip = connect_wifi()
        
        client = MQTTClient(MQTT_CLIENT_ID, MQTT_BROKER_IP, port=MQTT_PORT)
        client.connect()
        print(f"Connected to MQTT Broker at {MQTT_BROKER_IP}")
        
        # Initial Display
        update_display(STATES[current_state_idx], ip)

        last_btn_val = 1 # Pull-up means 1 is unpressed
        
        while True:
            # Button Debounce Logic
            current_btn_val = btn.value()
            
            # Detect Falling Edge (Press)
            if last_btn_val == 1 and current_btn_val == 0:
                current_state_idx = (current_state_idx + 1) % 3
                status = STATES[current_state_idx]
                
                print(f"State Changed: {status}")
                update_display(status, ip)
                
                # Publish Immediately
                payload = json.dumps({
                    "vehicle_id": VEHICLE_ID,
                    "timestamp": time.time(),
                    "status": status,
                    "lat": LAT,
                    "long": LONG,
                    "confidence": 0.99
                })
                client.publish(MQTT_TOPIC, payload)
                
                # LED Feedback
                if status == "fatigue":
                    led.off()
                else:
                    led.on()
                    
                time.sleep(0.2) # Simple debounce sleep

            last_btn_val = current_btn_val
            
            # Heartbeat publish every 2 seconds so dashboard knows we are alive
            # (Optional, but good for keeping "Last Seen" updated)
            # For now, we just loop fast to catch button presses.
            time.sleep(0.05)

    except Exception as e:
        print(f"Error: {e}")
        if 'oled' in locals():
            oled.fill(0)
            oled.text("ERROR:", 0, 0)
            oled.text(str(e), 0, 10)
            oled.show()
        time.sleep(5)
        machine.reset()

if __name__ == "__main__":
    main()
