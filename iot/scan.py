# I2C Scanner for Raspberry Pi Pico
import machine

# We try BOTH Hardware I2C and Software I2C to cover all bases

print("--- I2C Scanner Tool ---")

# 1. Try Software I2C (Most robust for jumpers)
print("[Test 1] Scanning with SoftI2C (GP0=SDA, GP1=SCL)...")
try:
    i2c_soft = machine.SoftI2C(sda=machine.Pin(0), scl=machine.Pin(1), freq=100000)
    devices = i2c_soft.scan()
    if devices:
        print(f"SUCCESS! Found devices: {[hex(d) for d in devices]}")
    else:
        print("No devices found via SoftI2C.")
except Exception as e:
    print(f"SoftI2C Error: {e}")

# 2. Try Hardware I2C (Standard)
print("[Test 2] Scanning with Hardware I2C(0) (GP0=SDA, GP1=SCL)...")
try:
    i2c_hard = machine.I2C(0, sda=machine.Pin(0), scl=machine.Pin(1), freq=400000)
    devices = i2c_hard.scan()
    if devices:
        print(f"SUCCESS! Found devices: {[hex(d) for d in devices]}")
    else:
        print("No devices found via Hardware I2C.")
except Exception as e:
    print(f"Hardware I2C Error: {e}")

print("--- Scan Complete ---")
print("If both are empty, check: VCC=3.3V, GND=GND, SDA=Pin1, SCL=Pin2")
