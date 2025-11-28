# SafeRide: The Official Demo Walkthrough 🎭

This guide is designed to help you present **SafeRide** effectively during a hackathon demo or presentation. It follows a narrative flow: **"From Risk to Reward."**

---

## 🎬 Phase 1: The Setup (Pre-Demo)

**Goal:** Ensure the system is live and clean.

1.  **Launch the Stack:**
    ```bash
    docker-compose up --build -d
    ```
2.  **Clear Old Data (Optional but Recommended):**
    ```bash
    docker exec -it saferide-redis redis-cli FLUSHALL
    docker restart saferide-backend
    ```
3.  **Open the Tabs:**
    *   [http://localhost:3000](http://localhost:3000) (Landing Page)
    *   [http://localhost:3000/dashboard](http://localhost:3000/dashboard) (The Main Interface)
    *   [https://explorer.solana.com/?cluster=devnet](https://explorer.solana.com/?cluster=devnet) (Keep this ready)

---

## 🗣️ Phase 2: The Pitch (Landing Page)

*Start at the **Landing Page**.*

> "SafeRide is a DePIN solution that incentivizes safe driving. We combine **AI** (Computer Vision), **IoT** (Vehicle Telemetry), and **Blockchain** (Immutable Logs) to create a complete safety ecosystem."

**Action:**
1.  Scroll down to show **"How It Works"**.
2.  Click **"Driver Portal"** to transition to the Dashboard.

---

## 🖥️ Phase 3: The Live Monitor (Dashboard)

*Transition to the **Dashboard**. It should be showing "Safe" (Green).*

> "This is the Fleet Commander view. Here, we see real-time telemetry from the vehicle."

**Highlight Features:**
1.  **Driver Status (Left Widget):** Currently **SAFE** (Green). Monitors fatigue/distraction via CV.
2.  **Vehicle Status (Left Widget):** Currently **SAFE** (Green). Monitors harsh braking/turns via IoT.
3.  **Wellness Widgets (Bottom):** Heart Rate, Fatigue Level, Alertness.
4.  **Blockchain Log (Right Panel):** Currently empty or showing "Safe Attestations".

---

## 🚨 Phase 4: The Incident (Simulation)

*Now, we simulate a dangerous event. Use the scripts in a separate terminal window.*

> "Let's see what happens when our AI detects a microsleep event."

**Action (Windows):**
```batch
scripts\windows\send_fatigue.bat
```
*(Mac/Linux: `scripts/linux/send_fatigue.sh`)*

**Observe & Narrate:**
1.  **Visual Alarm:** The "Driver Status" widget turns **RED** and pulses.
2.  **Graph Spike:** The behavior graph spikes to Level 5 (FATIGUE).
3.  **Blockchain Trigger:** Point to the "Incident History" list. A new entry appears: **"FATIGUE DETECTED"**.
4.  **Verification:**
    > "Critically, this event is not just stored in a database. It is signed and sent to the Solana Blockchain."
    *   Wait for the **"View on Solana"** link to appear (approx. 2-5 seconds).
    *   Click the link to open the Solana Explorer.
    *   **Show the Memo:** "SAFERIDE ALERT: fatigue | ID: v-101"

---

## 🧪 Phase 5: Multi-Modal Sensing (Vehicle Incident)

*Simulate a different type of risk to show the system's versatility.*

> "It's not just about the driver. Our IoT sensors also detect dangerous driving maneuvers."

**Action (Windows):**
```batch
scripts\windows\send_harsh_turn.bat
```
*(Mac/Linux: `scripts/linux/send_harsh_turn.sh`)*

**Observe:**
1.  **Visual Alarm:** The "Vehicle Status" widget turns **PURPLE**.
2.  **Differentiation:** Notice how the *Driver* status remains unaffected (or separate), while the *Vehicle* status flags the specific mechanical risk.

---

## 🏆 Phase 6: The Reward (Gamification)

*Transition to the **Rewards Page**.*

> "We don't just punish bad driving; we incentivize safety. Drivers earn points for 'Safe Streaks'."

**Action:**
1.  Click **"Rewards"** in the sidebar.
2.  Show the **Current Balance**.
3.  **Simulate Safety:** Run the safe script to accumulate points (you may need to run it 5 times quickly to trigger a streak if you reset the DB).
    *   *Windows:* `scripts\windows\send_safe_driver.bat`
    *   *Mac/Linux:* `scripts/linux/send_safe_driver.sh`
4.  **Redeem:**
    *   Click the **"Redeem"** button on a reward card (e.g., "5% Insurance Discount").
    *   Watch the balance decrease.
    *   > "This redemption is processed atomically, closing the loop between physical safety and economic value."

---

## 🏁 Phase 7: Closing

*Return to the Dashboard.*

> "This is SafeRide. From Edge AI detection to Blockchain verification, we are building the trust layer for the future of mobility."

---

**End of Demo.**
