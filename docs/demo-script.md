# SafeRide: The Winning Demo Script 🏆

**Duration:** 3 Minutes
**Goal:** Show, don't just tell. Prove the "Edge-to-Chain" pipeline works live.

---

## Phase 1: The Setup (Before you go on stage) 🛠️

1.  **Clean Slate:**
    *   Run `docker exec saferide-redis redis-cli FLUSHALL` (Clear old logs).
    *   Ensure `solana-wallet.json` has Devnet SOL.
2.  **Launch Backend:**
    *   Terminal 1: `cd backend && go run main.go`
    *   *Check:* Wait for "Gin server started".
3.  **Launch Frontend:**
    *   Terminal 2: `cd frontend && npm run dev`
    *   *Check:* Open `http://localhost:5173` in Chrome.
4.  **Launch CV Agent (The "Wow" Factor):**
    *   Terminal 3: `cv\.venv\Scripts\python.exe cv/main.py`
    *   *Check:* Ensure Webcam window is open and tracking your face. Minimize it but keep it running.
5.  **IoT Device:**
    *   Plug in Pico W. Ensure OLED says "WiFi Connected".

---

## Phase 2: The Pitch (On Stage) 🎤

**0:00 - The Hook**
*   "Road accidents are the #1 cause of death for young adults. Insurance companies punish us *after* the crash. But what if we could stop the crash *before* it happens?"
*   "Introducing **SafeRide**: A DePIN network that tokenizes safe driving."

**0:30 - The Dashboard (Show Screen)**
*   *Action:* Show the **Landing Page**. Click **"Driver Portal"** -> **"Sign In"** -> **Dashboard**.
*   "This is the Driver Command Center. It looks like a standard dashboard, but it's powered by Solana and Real-time IoT."

**1:00 - The "Magic" (Live Demo)**
*   *Action:* Bring the **CV Webcam Window** to the front.
*   "I am the driver. Watch what happens when I get drowsy."
*   *Action:* **Close your eyes** for 3 seconds.
*   *Result:*
    1.  CV Window: Text turns **RED** ("DROWSINESS ALERT").
    2.  Dashboard: Widget turns **RED** ("FATIGUE").
    3.  Audio: (Optional) "Intervention Alert".
*   "The system detected micro-sleep instantly. No cloud latency. Edge computing."

**1:30 - The Hardware (Pico W)**
*   *Action:* Pick up the Pico W.
*   "But cameras have blind spots. We verify this with vehicle telemetry."
*   *Action:* Press **Button 2 (Rash Driving)**.
*   *Result:* Dashboard Widget turns **PURPLE** ("RASH DRIVING").
*   "Hard braking detected via IMU simulation."

**2:00 - The Blockchain (The Trust Layer)**
*   *Action:* Point to the **"Recent Activity"** list on the Dashboard.
*   "Every single one of those events—my drowsiness, that hard brake—is now on the Solana Blockchain."
*   *Action:* Click the **blue "Tx Hash" link** for the "Rash Driving" event.
*   *Result:* Opens Solana Explorer. Show the **Memo field**: `"SAFERIDE ALERT: rash driving..."`
*   "This is immutable proof. I cannot delete this. The insurance company cannot fake this."

**2:30 - The Insurance Portal (The Business Model)**
*   *Action:* Click "Insurance Portal" in Sidebar (or switch tabs).
*   "Insurers use this data to automate claims. If I crash right now, the smart contract sees I was driving rashly and denies the claim automatically. If I drive safely for a month, I get a rebate in USDC."

**3:00 - Closing**
*   "SafeRide isn't just a dashcam. It's a **Portable Reputation Protocol**. We are saving lives and fixing the broken insurance model."
*   "Thank you."

---

## Phase 3: Disaster Recovery (If things break) 🚑

*   **Scenario A: Webcam freezes.**
    *   *Fix:* Kill Python terminal. Use the **Pico W Buttons** immediately. Say: "We have redundant sensors for exactly this reason."
*   **Scenario B: Solana Explorer is slow/down.**
    *   *Fix:* Show the "Verification" hash in the Dashboard list. Say: "The hash is generated locally and confirmed asynchronously. The network is verifying it as we speak."
*   **Scenario C: "Demo Gods" strike (Total Freeze).**
    *   *Fix:* Refresh the Dashboard page. The state is in Redis, it will persist.
