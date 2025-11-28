# Yet To Do & Discussion Points

This document outlines outstanding issues, architectural considerations, and future development steps before a production-ready release.

---

## 1. Graph Visualization: Lines Not "Overlapping" as Expected

**Issue:** The Dashboard graph, intended to show "Camera (AI)" and "Sensor (IoT)" data as overlapping lines, currently displays them as separate lines with gaps where one source has no data.

**Discussion:**
*   **Current Interpretation:** The current implementation correctly plots individual data points per source. "Overlapping" implies they share the same timeline and scale, allowing comparison of risk levels from different origins. Gaps occur when a source is not actively sending data (e.g., Pico is idle while CV is active).
*   **Desired Interpretation:** Do we want true *overlapping* in the sense of:
    *   **Gap Filling (Interpolation):** Fill `null` values with the previous data point (step function) or interpolate between points for a continuous line?
    *   **Simultaneous Data:** Do you expect a data point from *both* sources at *every* single timestamp? (This implies a more complex data alignment or a backend aggregation layer).

**Recommendation:** The current graph accurately represents sparse data from independent sources. Filling gaps or forcing simultaneous points adds complexity that may obscure the actual, intermittent nature of sensor/CV input. Let's confirm if the visual clarity is sufficient or if a different "overlapping" effect is truly desired.

---

## 2. SafeRide Monitor Ambiguity: Conflicting Input

**Issue:** With two active input sources (CV Agent and Pico W) publishing to the same MQTT topic, the single "SafeRide Monitor" widget (the large color-changing block) will display only the status from the *last received message*. If CV sends "Fatigue" and Pico sends "Stress" almost simultaneously, the monitor might "flicker" or show only one.

**Challenge:** What status should the monitor prioritize when multiple alerts are active?

**Options:**
1.  **Priority-based Aggregation:** Define a hierarchy (e.g., FATIGUE > RASH > STRESS > DISTRACTED > DROWSY > SAFE). The monitor always displays the highest severity active status from *any* source.
2.  **Time-based (Current):** Display the most recent status. This can lead to rapid changes if inputs conflict.
3.  **Combined Status:** Display "Multiple Alerts" or "FATIGUE + STRESS" (requires significant UI changes).
4.  **Source-Specific Monitors:** Have two smaller monitor widgets, one for "CV Status" and one for "IoT Status" (adds UI clutter).

**Decision Needed:** We need a clear rule for how the monitor should behave with conflicting or simultaneous inputs from different sources.

---

## 3. Rewards Section: Redeem Functionality (Mocked)

**Issue:** Clicking "Redeem Now" in the Rewards section does not actually deduct tokens from the balance.

**Reason:** This feature is currently a frontend mock-up. The `handleRedeem` function only triggers a JavaScript `alert()` and does not interact with the backend.

**Required Implementation:**
1.  **Backend API:** Create a new API endpoint (e.g., `/api/redeem-points`) in the Go backend that:
    *   Receives `vehicle_id` and `tokens_to_deduct`.
    *   Atomically deducts `tokens_to_deduct` from the `points:{vehicle_id}` key in Redis.
    *   Returns the new `tokenBalance`.
2.  **Frontend Integration:** Modify `handleRedeem` in `src/routes/rewards/+page.svelte` to:
    *   Make an `HTTP POST` request to the new backend API.
    *   Update the `tokenBalance` variable in the frontend upon successful response.
    *   Handle insufficient balance gracefully.

---

## 4. Refined Sensor Fusion Strategy: Driver vs. Vehicle Stats

**Problem Addressed:** Ambiguity in the "SafeRide Monitor" when conflicting signals arrive from different sources (CV vs. IoT/Vehicle Sensors). The current single monitor widget (color-changing block) is insufficient to represent two distinct domains of data.

**Proposed Solution:**
*   **Source Categorization:**
    *   **"Driver" Stats (from CV Agent):** Drowsy, Distracted, Fatigue, Safe (Driver).
    *   **"Vehicle" Stats (from Pico W/other sensors):** Rash Driving, Stress, (Heart Rate Mimic), Safe (Vehicle).
*   **Graph Visualization:** The existing dual-line graph ("Camera (AI)" vs. "Sensor (IoT)") already effectively separates these data streams, offering clarity on their independent timelines.
*   **Monitor Widget Redesign:**
    *   **Primary Monitor (Existing):** Will exclusively display the **"Driver" Status** derived from the Computer Vision agent. This ensures the main focus remains on the driver's immediate state.
    *   **Secondary Widget/Text Field:** Introduce a new, smaller widget or a dedicated text field, likely located directly below the primary "SafeRide Monitor", to display the **"Vehicle" Status**. This new field will show the most recent `RASH DRIVING`, `STRESS`, or `SAFE (Vehicle)` signal from the Pico W.
*   **OLED Display on Pico W:**
    *   The OLED will be updated to display **both** the "Driver" Status and the "Vehicle" Status, possibly side-by-side or alternating, to give a complete picture of the current state directly on the device.
    *   This will enhance the Pico W's role from just an input device to a critical visual feedback component.

**Benefit:** This approach significantly improves the clarity of the dashboard and better represents a real-world scenario where driver and vehicle telemetry are distinct but integrated data streams. It allows the main "Red Screen" to specifically highlight *driver-based* fatigue/distraction, while still presenting important *vehicle-based* alerts.