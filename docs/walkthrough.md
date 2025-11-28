# SafeRide Updates Walkthrough

## 1. Rewards Redemption
**Goal:** Make the "Redeem" button functional.

### Changes
- **Backend:** Added `POST /api/redeem-points` endpoint.
  - Accepts `{ "vehicle_id": "...", "points": 500 }`.
  - Atomically deducts points from Redis.
- **Frontend:** Updated `src/routes/rewards/+page.svelte`.
  - `handleRedeem` now calls the API.
  - Updates `tokenBalance` on success.

## 2. Monitor Ambiguity (Driver vs Vehicle)
**Goal:** Distinguish between CV (Driver) and IoT (Vehicle) alerts.

### Changes
- **IoT (`iot/main.py`):**
  - Changed "safe" status to "safe_vehicle".
  - Renamed "stress" -> **"hard braking"**.
  - Renamed "rash driving" -> **"harsh turn"**.
- **Backend (`mqtt_service.go`):**
  - Detects "safe_vehicle" -> Updates `vehicle_status` key.
  - Detects "harsh turn" / "hard braking" -> Updates `vehicle_status` key.
  - Detects "fatigue/distracted" -> Updates `driver_status` key.
  - Normalizes "safe_vehicle" to "safe" for the main status/history.
  - Adds `source` ("ai" or "iot") to the telemetry payload.
- **Backend (`http_routes.go`):**
  - `GET /api/status/:vehicle_id` now returns `driver_status` and `vehicle_status`.
- **Frontend (`dashboard/+page.svelte`):**
  - Split the "Live Monitor" into:
    - **Driver Status:** Shows Fatigue, Distracted, Safe.
    - **Vehicle Status:** Shows Harsh Turn, Hard Braking, Safe.

### 4. CV Agent Upgrade (Drowsiness & Robustness)
**Goal:** Send intermediate "Drowsy" alert and filter false positives (Sneezing).

### Changes
- **CV (`cv/main.py`):**
  - **Added MAR (Mouth Aspect Ratio):** Detects Yawning.
  - **Updated Thresholds:**
    - **Drowsy:** Eyes closed for 1.5s (45 frames) OR Yawning.
    - **Fatigue:** Eyes closed for 2.5s (75 frames) -> Microsleep.
  - **Sneeze Filter:** If Eyes Closed < 1.0s AND Mouth Open -> Ignored (Likely Sneeze/Talking).

## 3. Graph Visualization
**Goal:** Show overlapping lines for AI and IoT data with accurate severity scale.

### Changes
- **Backend:** Added `source` field to Telemetry history.
- **Frontend:** Updated Chart.js logic in Dashboard.
  - **Y-Axis Scale:**
    - 0: Safe
    - 1: Distracted
    - 2: Harsh Turn
    - 3: Drowsy
    - 4: Hard Braking
    - 5: FATIGUE
  - **Dataset 1 (Blue):** Driver Risk (Source: AI).
  - **Dataset 2 (Purple):** Vehicle Risk (Source: IoT).

## Verification Steps
1.  **Run Infrastructure:** `docker-compose up --build -d` (One-Click)
2.  **Flush Cache (Clean Slate):**
    - **Redis:** `docker exec -it saferide-redis redis-cli FLUSHALL`
    - **Restart Backend:** `docker restart saferide-backend`
3.  **Test Rewards:** Go to `/rewards`, click Redeem. Check if points deduct.
4.  **Test Monitor:**
    - **Windows:** Run `scripts/windows/send_harsh_turn.bat` -> Verify "Vehicle Status" updates to Purple.
    - **Linux/Mac:** Run `scripts/linux/send_fatigue.sh` -> Verify "Driver Status" updates to Red.
5.  **Test Graph:** Generate both alerts and watch the graph plot two lines at correct Y-levels.