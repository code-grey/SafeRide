Here is the Official SafeRide Workflow Protocol. Save this as WORKFLOW_PROTOCOL.md in your project root.

You can paste this entire block into the Gemini CLI at the start of every session. It serves as the "Rules of Engagement" so the AI stays aligned with your specific hybrid strategy.

SafeRide Workflow Protocol & Instructions
Role: Senior Lead Architect & DevOps Engineer Project: SafeRide (DePIN IoT Prototype) Deadline: Nov 30th (Strict)

1. Directory Structure Rule
The system assumes this exact structure. Do not deviate.

Plaintext

/SafeRide
  ├── SafeRide_Development_Plan.md
  ├── docker-compose.infra.yml    <-- DEV ONLY (Redis + MQTT)
  ├── docker-compose.yml          <-- PROD/DEMO (Full Stack)
  ├── backend/
  │   ├── Dockerfile              <-- Production Build (Lean)
  │   ├── main.go
  │   └── go.mod
  ├── frontend/
  │   ├── Dockerfile
  │   └── package.json
  └── iot/
      └── main.py                 <-- MicroPython for Pico
2. Phase A: DEVELOPMENT Workflow (Now - Nov 29)
Strategy: "Hybrid Mode". Infrastructure in Docker, Code on Metal.

Instructions for AI:

Never suggest running docker build for the backend or frontend during this phase.

Assume Redis and MQTT are running on localhost.

Developer Instructions:

Start Infrastructure:

Bash

# Starts Redis (6379) and Mosquitto (1883) in background
docker-compose -f docker-compose.infra.yml up -d
Run Backend (Hot):

Bash

cd backend
# Vital: Env vars pointing to localhost
export REDIS_ADDR=localhost:6379
export MQTT_BROKER=tcp://localhost:1883
go run main.go
Run Frontend (Hot):

Bash

cd frontend
npm run dev
3. Phase B: DEMO Workflow (Nov 30)
Strategy: "Full Containerization". Single command launch.

Instructions for AI:

Ensure the backend/Dockerfile uses the lean build flags: -ldflags="-s -w" -trimpath.

Ensure docker-compose.yml networks the containers together (Backend talks to redis service name, not localhost).

Developer Instructions:

Stop Dev Infra:

Bash

docker-compose -f docker-compose.infra.yml down
Build & Launch System:

Bash

# Builds Go binary and Svelte static site
docker-compose up --build
4. Networking Critical Constraints
Rule 1: The Pico W Hardcoding The Raspberry Pi Pico W cannot access localhost.

Action: You must find your laptop's Local IP (e.g., 192.168.x.x).

Code: Hardcode this IP into iot/main.py.

Rule 2: MQTTS Port

Dev: Connect to tcp://localhost:1883.

Prod: Connect to tcp://mosquitto:1883 (Internal Docker Network).

5. Security & Build Standards
Backend Dockerfile (Production Standard): Use this exact multi-stage build to keep the binary under 15MB:

Dockerfile

# backend/Dockerfile
FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# LEAN BUILD FLAGS
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -trimpath -o saferide-engine .

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/saferide-engine .
EXPOSE 8080
CMD ["./saferide-engine"]
End of Protocol. If the user asks "How do I run this?", determine the current date/phase and serve the appropriate command set from Section 2 or 3.
