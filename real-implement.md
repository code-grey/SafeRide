# SafeRide: Production Hardware Roadmap (V2)

## Executive Summary
The current SafeRide prototype demonstrates the core "Edge-to-Chain" data pipeline using Computer Vision (CV) and simulation buttons. 
To deploy this as a real-world DePIN product, we need to move from "Inference" to "Sensor Fusion." 

This document outlines the hardware and logic required to capture the full spectrum of driver risks: **Rash Driving**, **Stress**, and **Cognitive Distraction**.

---

## 1. Rash Driving Detection (Vehicle Dynamics)
**The Problem:** CV sees the driver, not the car. It cannot feel G-forces.
**The Solution:** Inertial Measurement Unit (IMU) & OBD-II.

### Hardware Stack
*   **Primary Sensor:** **6-Axis IMU (e.g., MPU-6050 or LSM6DS3)**.
    *   *Cost:* <$2.00.
    *   *Interface:* I2C to Pico W.
*   **Secondary Sensor:** **GNSS/GPS Module (e.g., NEO-6M)**.
    *   *Cost:* <$5.00.
    *   *Data:* Velocity (Speeding) and Location.

### Detection Logic
*   **Hard Braking:** `Acc_Y < -0.6g` (Sudden deceleration).
*   **Sharp Cornering:** `|Acc_X| > 0.5g` (Lateral force).
*   **Jackrabbit Start:** `Acc_Y > 0.5g` (Sudden acceleration).
*   **Speeding:** GPS Speed > Speed Limit (via Map API lookup).

---

## 2. Stress & Health Monitoring (Biometrics)
**The Problem:** Stress is internal. Cameras only see the symptoms (facial micro-expressions), which is unreliable.
**The Solution:** Physiological Signals (GSR & HRV).

### Hardware Stack
*   **Primary Sensor:** **Galvanic Skin Response (GSR)**.
    *   *Placement:* Steering wheel grip pads.
    *   *Mechanism:* Measures skin conductivity (Electrodermal Activity). Fear/Stress = Sweat = Higher Conductivity.
*   **Secondary Sensor:** **PPG / Heart Rate (Smartwatch Integration)**.
    *   *Protocol:* Bluetooth Low Energy (BLE).
    *   *Metric:* **Heart Rate Variability (HRV)**. High Stress = Low HRV (The heart becomes robotic/metronomic).

### Detection Logic
*   **Acute Stress Event:** Sudden spike in GSR conductivity + Drop in HRV.
    *   *Trigger:* Near-miss accident or road rage.
*   **Chronic Fatigue:** Slow, steady decline in Heart Rate over 1 hour.

---

## 3. Distraction (Cognitive & Visual)
**The Problem:** A driver can look at the road but be mentally "gone" (Cognitive Tunneling).
**The Solution:** Eye Gaze Tracking + CAN Bus Fusion.

### Hardware Stack
*   **Sensor:** **IR Eye Tracker** (mounted on dashboard, looking up).
    *   *Advantage:* Works through sunglasses and in pitch black.
*   **Data Source:** **Vehicle CAN Bus (OBD-II)**.
    *   *Data:* Steering Angle, Lane Keeping Assist status.

### Detection Logic
*   **Visual Distraction:** Gaze vector intersects with "Infotainment Screen" or "Phone" region for > 2.0 seconds while Velocity > 10 km/h.
*   **Cognitive Distraction:** "Staring" (Blink rate drops significantly) + Steering micro-corrections disappear.

---

## 4. The "Black Box" (Data Integrity)
**The Problem:** How do we prove the data is real and not spoofed?
**The Solution:** Trusted Execution Environment (TEE) & DePIN Hardware.

### Hardware Stack
*   **Secure Element:** **ATECC608** or similar Crypto Chip.
    *   *Function:* Stores the Solana Private Key in hardware. The key never leaves the chip. Signs every data packet internally.
*   **Connectivity:** **LoRaWAN / Helium Network**.
    *   *Function:* Upload critical alerts even in dead zones (No 4G/5G).

---

## Summary Table

| Risk Signal | Current (Prototype) | V2 Hardware Solution | V2 Logic |
| :--- | :--- | :--- | :--- |
| **Drowsiness** | Webcam (EAR) | IR Camera + Steering Sensor | PERCLOS + Micro-steering analysis |
| **Distraction** | Webcam (Head Pose) | Eye Gaze Tracker | Gaze Vector Analysis |
| **Rash Driving** | Simulated | 6-Axis IMU (Accelerometer) | G-Force Thresholds |
| **Stress** | Simulated | Steering Wheel GSR Pads | Skin Conductivity Spikes |
| **Identity** | Mock Login | NFC / Biometric Scanner | Driver ID Verification |

*SafeRide V2 transforms the vehicle into a verified node in the DePIN ecosystem.*
