import network
import time
import json
import machine
from umqtt.simple import MQTTClient
import sh1106

# ==========================================
# 1. CONFIGURATION
# ==========================================
WIFI_SSID = "Airel_6000298987"        # <--- Update this!
WIFI_PASSWORD = "air00022" # <--- Update this!
MQTT_BROKER_IP = "192.168.1.5"      # <--- Update this!
# ==========================================
# 2. HARDWARE SETUP
# ==========================================
# Wires
btn_safe = machine.Pin(14, machine.Pin.IN, machine.Pin.PULL_UP)
btn_fatigue = machine.Pin(15, machine.Pin.IN, machine.Pin.PULL_UP)
btn_distracted = machine.Pin(16, machine.Pin.IN, machine.Pin.PULL_UP)

# OLED (SH1106 for 1.3" 128x64)
i2c = machine.SoftI2C(sda=machine.Pin(0), scl=machine.Pin(1), freq=100000)
oled = sh1106.SH1106_I2C(128, 64, i2c, addr=0x3c)
led = machine.Pin("LED", machine.Pin.OUT)

# ==========================================
# 3. LOGIC
# ==========================================
MQTT_TOPIC = "vehicles/v-101/telemetry"

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

def draw_status(status):
    oled.fill(0)
    oled.text("SafeRide", 35, 0)
    
    # Draw a simple frame
    oled.rect(0, 15, 128, 49, 1)
    
    status = status.upper()
    # Center text roughly (approx 8px per char)
    x_pos = 64 - (len(status) * 4)
    oled.text(status, x_pos, 35)
    
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
        draw_status("SAFE")
        
        last_press = 0
        while True:
            now = time.time()
            status = None
            
            if btn_safe.value() == 0: status = "safe"
            elif btn_fatigue.value() == 0: status = "fatigue"
            elif btn_distracted.value() == 0: status = "distracted"
            
            # Trigger only if button pressed & debounce passed
            if status and (now - last_press > 0.5):
                print(f"Sending: {status}")
                draw_status(status)
                
                payload = json.dumps({
                    "vehicle_id": "v-101",
                    "timestamp": time.time(),
                    "status": status,
                    "lat": 28.7041,
                    "long": 77.1025,
                    "confidence": 0.99
                })
                client.publish(MQTT_TOPIC, payload)
                last_press = now
                
                # Blink LED
                led.off()
                time.sleep(0.1)
                led.on()

            time.sleep(0.05)

    except Exception as e:
        print(e)
        oled.fill(0)
        oled.text("Error:", 0, 0)
        oled.text(str(e)[:16], 0, 15) # Truncate error
        oled.show()
        machine.reset()

if __name__ == "__main__":
    main()
