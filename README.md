# SafeRide: DePIN Driver Safety Network 🛡️🚗

**SafeRide** is a Decentralized Physical Infrastructure Network (DePIN) prototype that incentivizes safe driving using AI, IoT, and the Solana Blockchain.

## 🌟 Features

*   **AI-Powered Monitoring:** Computer Vision (MediaPipe) detects Drowsiness and Distraction in real-time.
*   **IoT Telemetry:** Raspberry Pi Pico W simulates vehicle dynamics (Rash Driving, Stress).
*   **Immutable Ledger:** Every critical event is cryptographically signed and logged on the **Solana Devnet**.
*   **Real-Time Dashboard:** A SvelteKit + Tailwind v4 dashboard visualizing driver state and blockchain verification.
*   **Insurance AI:** Proof-of-Concept underwriting model based on behavioral data.

---

## 🏗️ Architecture

`Webcam/IoT -> MQTT Broker -> Go Backend -> Redis (Hot State) -> SvelteKit Frontend`
`Backend -> Solana Blockchain (Memo Program)`

---

## 🚀 Getting Started

### Prerequisites
*   **Docker** & **Docker Compose**
*   **Go** (v1.23+)
*   **Node.js** (v18+)
*   **Python** (v3.10+ for CV Agent)

### 1. Start Infrastructure (MQTT + Redis)
```bash
docker-compose -f docker-compose.infra.yml up -d
```

### 2. Start Backend (Go)
```bash
cd backend
go run main.go
```

### 3. Start Frontend (SvelteKit)
```bash
cd frontend
npm install
npm run dev
```
Access the dashboard at `http://localhost:5173/dashboard`.

### 4. Start Computer Vision Agent ("Project Hawkeye") 🦅
Use the helper script for your OS:

**Windows:**
```batch
run_cv.bat
```

**Mac/Linux:**
```bash
./run_cv.sh
```

---

## 🧪 Simulation Tools

Don't have a webcam? Use our simulation scripts to trigger events manually:

*   **Safe:** `scripts/send_safe.bat` / `.sh`
*   **Fatigue:** `scripts/send_fatigue.bat` / `.sh`
*   **Rash Driving:** `scripts/send_rash.bat` / `.sh`

---

## 📚 Documentation

*   [Development Blog](docs/dev-blog.md) - The journey from idea to prototype.
*   [Hardware Roadmap (V2)](docs/real-implement.md) - Plans for IMU/OBD-II integration.
*   [Insurance AI Logic](docs/insurance-ai-logic.md) - The math behind the risk score.
*   [Market Analysis](docs/market-analysis.md) - USP and Competitor landscape.
*   [Demo Script](docs/demo-script.md) - Step-by-step walkthrough.

---

**License:** MIT
**Built for the DePIN Hackathon 2025.**
