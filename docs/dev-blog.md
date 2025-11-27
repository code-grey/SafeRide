# Building SafeRide: A DePIN Journey (Technical Deep Dive)

**Authors:** Code-Grey & Gemini (The AI Co-Pilot)
**Stack:** Go (Gin), SvelteKit, Solana (Go SDK), Raspberry Pi Pico W (MicroPython), Redis, MQTT

---

## Part 1: The Foundation - "Docker, Go, and the Red Screen" 🔴

We had a clear mission: Build a **Decentralized Physical Infrastructure Network (DePIN)** prototype to detect driver fatigue and log it on the Solana blockchain. The deadline was strict (4 days), so we had to choose a stack that was fast, compiled, and robust.

### The Architecture
We chose an Event-Driven Architecture:
`IoT Sensor (Pico W) -> MQTT Broker -> Go Backend -> Redis (Hot State) -> SvelteKit Frontend`

### The "Windows" Hurdle & Docker Networking
Starting on Windows is always an adventure. We fired up our `docker-compose.infra.yml` to run **Redis** and **Mosquitto (MQTT)**. We immediately hit a wall: the Pico W couldn't talk to `localhost`.
*   **The Fix:** We realized that `localhost` inside a Docker container isn't `localhost` on the host machine, and definitely isn't `localhost` for a Pico W on the same Wi-Fi.
*   **The Solution:** We hardcoded the laptop's local IP (`192.168.x.x`) into the Pico's firmware and exposed port `1883` on the Mosquitto container.

### The Backend: Pragmatism over Perfection
We debated: **WebSockets vs. Polling?**
For a production app, WebSockets are king. But for a 4-day hackathon? They introduce state management complexity (reconnections, heartbeat).
*   **Our Choice:** **Short Polling (1 second)**.
*   **Why?** It's stateless. If the server crashes and restarts, the frontend just picks up on the next fetch. No broken pipes.

**The Go Code (Ingestion):**
```go
// We ingest telemetry and save to Redis with a 1-hour expiration (TTL)
// This keeps our memory footprint tiny.
var onMessageReceived mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
    // ... unmarshal JSON ...
    err := redisClient.Set(ctx, data.VehicleID, payload, time.Hour).Err()
    if data.Status == "fatigue" {
        go sendSolanaAlert(data) // Async blockchain logging
    }
}
```

---

## Part 2: The Edge - "One Button to Rule Them All" 🔘

Day 2 was about the physical world. We needed to simulate driver states (Safe, Distracted, Fatigue) using a Raspberry Pi Pico W.

### The Hardware Constraint
We realized we only had **one external button** available.
*   **The Problem:** How do you trigger 3 distinct states with a single binary input?
*   **The Solution:** A **Cyclic State Machine**.

We wrote a MicroPython script that advances the state index on every button press (debounced):
`Safe (Green) -> Distracted (Orange) -> Fatigue (Red) -> Safe`

**The MicroPython Logic:**
```python
# State Machine
STATES = ["safe", "distracted", "fatigue"]
current_state_idx = 0 

# ... inside the loop ...
if btn.value() == 0: # Button Pressed
    current_state_idx = (current_state_idx + 1) % 3
    status = STATES[current_state_idx]
    update_oled(status) # Visual feedback for the driver
    publish_mqtt(status)
```

We also integrated an **SSD1306 OLED** display so the driver knows exactly what's being broadcasted.

---

## Part 3: The Blockchain - "The Battle of Base58" ⚔️

This was the hardest day. We needed to create an immutable "Proof of Fatigue" on Solana.

### The "Blank Check" Nightmare
We started by sending a simple **System Transfer (0 SOL)** to ourselves.
*   **Result:** It worked, but the block explorer just showed "Transfer". It looked like a financial transaction, not a data log. It was a receipt with no items.

### The Quest for the Memo
We decided to use the **SPL Memo Program** to attach text data ("SAFERIDE ALERT: rash driving") to the transaction.
This is where things got spicy.

**Attempt 1: The Mystery ID**
We tried using a Memo Program ID we found online. The Go backend crashed immediately:
`panic: decode: invalid base58 digit ('l')`

**The Investigation:**
We looked closer at the ID we pasted: `Memo1...Lel...`.
*   **The Realization:** Base58 encoding (used by Solana addresses) **explicitly excludes** the characters `0`, `O`, `I`, and `l` to avoid visual confusion. The ID we found was a typo or a bad copy-paste. It was literally impossible to decode.

**Attempt 2: The "Program Not Found"**
We switched to a valid ID, but forgot to declare our wallet as a **Signer** for the Memo instruction.
*   **The Error:** `Transaction simulation failed: Attempt to load a program that does not exist`.
*   **The Fix:** In Solana, even if you are just writing text, you must "sign" the memo so the network knows *who* wrote it.

**The Final Working Code:**
```go
// Correct SPL Memo Program ID (Memo v1)
memoProgramID := solana.MustPublicKeyFromBase58("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")

memoInstr := solana.NewInstruction(
    memoProgramID,
    solana.AccountMetaSlice{
        solana.Meta(solanaWallet.PublicKey()).SIGNER(), // Crucial!
    }, 
    []byte("SAFERIDE ALERT: rash driving | CONF: 0.95"),
)
```

### The Victory
We ran the script. The dashboard turned **Purple** (Rash Driving).
A generic "Pending Verification" badge appeared... and 5 seconds later... **"✅ Verified on Solana"**.
We clicked the explorer link, and there it was: Our custom text, etched into the Devnet forever.

---

## Summary & Next Steps
We successfully built a full-stack DePIN prototype.
*   **IoT:** Real-time state cycling with OLED feedback.
*   **Backend:** Robust ingestion + Async Blockchain signing.
*   **Frontend:** Reactive UI with 5 distinct danger states.

**Up Next:** We enter "Day 4". We are looking at containerizing the entire solution for a one-click deployment and adding the final polish for the demo.

*SafeRide is ready to roll.* 🚗💨