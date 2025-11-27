# SafeRide Production Deployment Instructions

This document outlines the essential environment variables and considerations for deploying the SafeRide application in a production Dockerized environment, allowing for easy configuration and credential management.

## 1. Backend Service (Go Gin Application)

The Go backend (`saferide.exe`) requires the following environment variables. It's recommended to manage these using Docker secrets or a robust secret management solution in production.

| Environment Variable    | Description                                                                                                                                                                                                                                                                                              | Default (Dev)                                      | Example (Prod)                                              |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------- | :---------------------------------------------------------- |
| `GIN_MODE`              | Sets the Gin web framework mode. Should be `release` for production to disable debug output and improve performance.                                                                                                                                                                                     | `debug`                                            | `release`                                                   |
| `API_PORT`              | The port on which the Gin server listens for incoming HTTP requests.                                                                                                                                                                                                                                 | `8080`                                             | `80` (for public access) or `8080` (internal to Docker)     |
| `REDIS_ADDR`            | The network address (host:port) of the Redis server.                                                                                                                                                                                                                                                 | `localhost:6379`                                   | `redis-service:6379` (Docker internal) or `your.redis.host:6379` |
| `MQTT_BROKER`           | The network address (protocol://host:port) of the MQTT broker.                                                                                                                                                                                                                                         | `tcp://localhost:1883`                             | `tcp://mqtt-service:1883` (Docker internal) or `ssl://your.mqtt.broker:8883` |
| `SOLANA_RPC_URL`        | The URL of the Solana RPC node. Use `https://api.devnet.solana.com` for Devnet or `https://api.mainnet-beta.solana.com` for Mainnet.                                                                                                                                                                  | `https://api.devnet.solana.com` (hardcoded in code) | `https://api.mainnet-beta.solana.com`                     |
| `SOLANA_PRIVATE_KEY_BASE64` | **CRITICAL SECRET:** The base64-encoded string of the Solana wallet's private key (from `solana-wallet.json`). This wallet is used to sign incident logging transactions. **WARNING: Storing private keys directly in environment variables is not recommended for high-security production environments. Consider Docker Secrets, Kubernetes Secrets, or a dedicated secret management service.** | N/A                                                | `rqFyisOrcgaX5SWHPlerggOg5wt6BXTpuZNVjx2AUdSn0EgLq/...` (truncated example) |

**Example Docker Compose for Production (illustrative):**

```yaml
version: '3.8'
services:
  backend:
    image: saferide-backend:latest
    environment:
      - GIN_MODE=release
      - API_PORT=8080
      - REDIS_ADDR=redis:6379
      - MQTT_BROKER=tcp://mosquitto:1883
      - SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
      # For SOLANA_PRIVATE_KEY_BASE64, strongly prefer Docker secrets:
      # - SOLANA_PRIVATE_KEY_BASE64=${SOLANA_PRIVATE_KEY_BASE64} 
    # Use Docker secrets for production private keys
    secrets:
      - solana_private_key
    environment:
      # Reference the secret file path
      - SOLANA_PRIVATE_KEY_PATH=/run/secrets/solana_private_key 
    ports:
      - "80:8080" # Map host port 80 to container port 8080
    depends_on:
      - redis
      - mosquitto

  redis:
    image: redis:alpine
    # ... other redis config

  mosquitto:
    image: eclipse-mosquitto
    # ... other mosquitto config

secrets:
  solana_private_key:
    file: ./solana_private_key.txt # This file should contain the base64 encoded private key
                                   # and MUST NOT be committed to version control.
```
*Note: In the Docker Compose example, `SOLANA_PRIVATE_KEY_PATH` would be read by the Go application, which would then read the content of the mounted secret file at that path.*

## 2. Frontend Service (SvelteKit Application)

The SvelteKit frontend typically uses build-time environment variables for API endpoints.

| Environment Variable    | Description                                                                                                                             | Default (Dev)                      | Example (Prod)                            |
| :---------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------- | :---------------------------------------- |
| `VITE_PUBLIC_API_BASE_URL` | The base URL of the backend API. Used by the SvelteKit application to make API calls. This should point to your deployed backend. | `http://localhost:8080`            | `https://api.yourdomain.com`            |

**Example `frontend/.env` file for production build (or passed during build process):**

```
VITE_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

---
