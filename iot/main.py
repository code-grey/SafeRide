import network
import time
import json
import machine
from umqtt.simple import MQTTClient
import sh1306 # This should be sh1106

# ==========================================
# 1. CONFIGURATION
# ==========================================
WIFI_SSID = "Airel_6000298987"        # <--- Update this!
WIFI_PASSWORD = "air00022" # <--- Update this!
MQTT_BROKER_IP = "192.168.1.4"      # <--- Update this!

# ==========================================
# 2. HARDWARE SETUP
# ==========================================
# Wires (Back to Safe, Rash, Stress)
btn_safe = machine.Pin(14, machine.Pin.IN, machine.Pin.PULL_UP)
btn_rash = machine.Pin(15, machine.Pin.IN, machine.Pin.PULL_UP)
btn_stress = machine.Pin(16, machine.Pin.IN, machine.Pin.PULL_UP)

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

def draw_status(status_text): # Reverted to single status
    oled.fill(0)
    oled.text("SafeRide", 35, 0)
    
    # Draw frame
    oled.rect(0, 15, 128, 49, 1)
    
    status_text = status_text.upper()
    # Center text roughly
    x_pos = max(0, 64 - (len(status_text) * 4))
    oled.text(status_text, x_pos, 35)
    
    oled.show()

def main():
    try:
        ip = connect_wifi()
        if not ip:
            oled.text("WiFi Failed", 0, 30)
            oled.show()
            return

        client = MQTTClient("pico-w-saferide", MQTT_BROKER_IP, port=1883)
        client.connect()

        # Initial Screen
        draw_status("READY")
        
        last_press = 0
        while True:
            now = time.time()
            status_to_send = None
            
            if btn_safe.value() == 0: status_to_send = "safe_vehicle"
            elif btn_rash.value() == 0: status_to_send = "harsh turn"
            elif btn_stress.value() == 0: status_to_send = "hard braking"
            
            if status_to_send and (now - last_press > 0.5):
                print(f"Sending: {status_to_send} (from Pico)")
                draw_status(status_to_send) # Update OLED immediately
                
                payload = json.dumps({
                    "vehicle_id": VEHICLE_ID,
                    "timestamp": time.time(),
                    "status": status_to_send,
                    "lat": 28.7041,
                    "long": 77.1025,
                    "confidence": 0.99 # No source field
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
