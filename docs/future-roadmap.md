# Future Roadmap: Production Hardening 🛡️

This document outlines the architectural steps required to transition SafeRide from a "Hackathon Prototype" to a "Production Deployment".

## 1. Nginx Reverse Proxy (The Gateway)

Currently, we expose ports `3000` (Frontend) and `8080` (Backend) directly. In production, we should sit them behind a single Reverse Proxy.

### Architecture
`Client (Browser) -> Nginx (Port 80/443) -> [Internal Docker Network] -> SvelteKit (3000) / Go (8080)`

### Implementation Plan
1.  **New Service:** Add `nginx` to `docker-compose.yml`.
2.  **Configuration (`nginx.conf`):**
    ```nginx
    server {
        listen 80;
        server_name saferide.io;

        # Frontend (SvelteKit)
        location / {
            proxy_pass http://saferide-frontend:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
        }

        # Backend API (Go)
        location /api/ {
            proxy_pass http://saferide-backend:8080;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
    ```
3.  **SSL/TLS:** Integrate **Certbot** for auto-renewing Let's Encrypt certificates.

## 2. Database Persistence
*   **Redis:** Currently used for both Hot State and "Persistence".
*   **Upgrade:** Introduce **PostgreSQL** for user data (Profiles, Auth) and long-term analytics history, keeping Redis strictly for caching and real-time pub/sub.

## 3. SvelteKit Node Adapter
*   **Current:** `npm run preview` (Static Preview).
*   **Upgrade:** Switch `svelte.config.js` to `@sveltejs/adapter-node`.
*   **Docker Command:** Change `CMD` to `node build/index.js` for optimized performance.
