SafeRide: 4-Day Development Sprint Plan

Deadline: November 30th
Objective: Deliver a working "Edge-to-Blockchain" prototype.

1. The API Contract (The "Source of Truth")

All teams (IoT, Backend, Frontend) must adhere to this STRICTLY.

A. IoT Telemetry (MQTT Topic: vehicles/+/telemetry)

From Pico W -> Go Backend

{
  "vehicle_id": "v-101",
  "timestamp": 1716300000,
  "status": "safe",  // Enum: "safe", "fatigue", "distracted"
  "lat": 28.7041,
  "long": 77.1025,
  "confidence": 0.99  // 0.0 to 1.0
}


B. Dashboard Real-Time Feed (HTTP / WebSocket)

From Go Backend -> Svelte Frontend

{
  "type": "update",
  "data": {
    "vehicle_id": "v-101",
    "current_status": "fatigue",
    "is_verified_on_chain": false,
    "last_seen": "10 seconds ago"
  }
}


C. Blockchain Proof (Solana Transaction Memo)

What gets stored on-chain

"SafeRide:v-101:FATIGUE:1716300000:hash_of_log_data"


2. Daily Sprint Schedule

Day 1: The Foundation (Nov 26)

Goal: Connectivity.

Infra: Run docker-compose.infra.yml.

IoT: Flash Pico W (MicroPython). Make it connect to Wi-Fi and publish JSON to your laptop's IP.

Backend: Go app connects to MQTT & Redis. Logs "Message Received" to console.

Frontend: Empty SvelteKit app running on localhost:5173.

Day 2: The Core Logic (Nov 27)

Goal: Real-time "Red Screen".

Backend: Logic to parse JSON. If status == fatigue, set Redis key v-101 to FATIGUE.

Frontend: Svelte component polls Go API every 1s (or uses SSE). If API says FATIGUE, CSS background turns Red.

Deliverable: Press Button on Pico -> Screen turns Red.

Day 3: The Trust Layer (Nov 28)

Goal: Solana Integration.

Blockchain: Get Solana Devnet Keypair.

Backend: When Fatigue is detected, trigger a Go function to send a Solana Transaction with the alert data in the Memo field.

Frontend: Display the "Transaction Hash" link on the dashboard once confirmed.

Day 4: The Final Polish (Nov 29)

Goal: Deployment & Demo Prep.

Morning: Execute Emergency Cuts if behind schedule.

Afternoon: CSS cleanup. Make it look "Enterprise".

Evening: Write the full docker-compose.yml (Backend + Frontend) for the one-click demo on stage.

3. The Emergency Cut List (Nov 29th Checkpoint)

CUT: Flutter App. Use Mobile-View Svelte web app.

CUT: Persistent DB (Postgres). Use Redis only.

CUT: Complex Smart Contract. Use simple Solana "Memo" transactions.

CUT: TinyGo. Stick to MicroPython for Pico.

4. Tech Stack Reference

Backend: Gin (Golang) latest

Frontend: SvelteKit + TailwindCSS

Cache: Redis

IoT: Raspberry Pi Pico W (MicroPython)

Blockchain: Solana Devnet