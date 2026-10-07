# CampusSphere: Production Deployment & Containerization Guide
**Version:** 2.0.0-PROD  
**Target Platform:** Docker, Docker Compose, Linux VPS (Ubuntu/Debian), Cloud Container Services (AWS ECS, GCP Cloud Run, Render, Railway)

---

## 1. System Architecture in Production

```
                      Internet / Browser Traffic
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │    Nginx Web Server (Alpine)  │  Port 80 / 443
                  │  - React 19 Static SPA Assets │
                  │  - Gzip Dynamic Compression   │
                  │  - Security Headers Enforced  │
                  └───────────────┬───────────────┘
                                  │
               Proxy /api/* calls │ Internal Docker Network (campussphere-net)
                                  ▼
                  ┌───────────────────────────────┐
                  │  Spring Boot Microservice     │  Port 8080 (Internal)
                  │  - Java 21 Temurin Alpine     │
                  │  - Spring Actuator Probes     │
                  │  - Non-root user 'spring'     │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │      MongoDB Atlas Cloud      │  Port 27017 (TLS/SRV)
                  │  - Multi-Region Primary Set   │
                  │  - Automated Cloud Backups    │
                  └───────────────────────────────┘
```

---

## 2. Quickstart with Docker Compose

### Prerequisites
- Docker Engine $\ge 24.0$
- Docker Compose v2 $\ge 2.20$

### 1-Command Startup
In the repository root:
```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Build and launch all containers in detached mode
docker compose up -d --build

# 3. View live logs
docker compose logs -f
```

Access the application:
- **Frontend Web UI:** `http://localhost`
- **Backend Health Check:** `http://localhost:8080/actuator/health`
- **Backend API:** `http://localhost:8080/api/clubs`

### Teardown
```bash
docker compose down
```

---

## 3. Environment Variables Reference

| Variable | Description | Default / Example |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas cluster connection string | `mongodb+srv://user:pass@cluster.mongodb.net/campussphere` |
| `MONGODB_DATABASE` | Primary database name | `campussphere` |
| `SERVER_PORT` | Spring Boot HTTP port | `8080` |
| `CLIENT_PORT` | Exposed HTTP port for Nginx | `80` |
| `CLIENT_SSL_PORT` | Exposed HTTPS port for Nginx | `443` |
| `VENUE_SETUP_BUFFER` | Event setup collision buffer (minutes) | `30` |
| `VENUE_CLEANUP_BUFFER` | Event cleanup collision buffer (minutes) | `30` |
| `RAZORPAY_KEY_ID` | Razorpay Merchant Key ID | `rzp_live_...` or `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Merchant Secret | Secret key string |
| `JWT_SECRET` | 256-bit secret key for token signing | High-entropy string |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `prod` |

---

## 4. Production Hardening Features

### 1. Minimal Alpine Base Images
- Both client and server use lightweight Alpine Linux distribution, shrinking image footprint from $>1\text{ GB}$ to $<280\text{ MB}$.

### 2. Multi-Stage Builds
- Compilers (Maven, Node.js SDKs, build tools) are completely purged from the final runtime layers, minimizing the attack surface.

### 3. Non-Root Process Execution
- The Spring Boot microservice executes under a dedicated system user `spring` (`UID 100` / `GID 101`), preventing container escape escalation.

### 4. Automated Container Health Probes
- `docker-compose.yml` specifies explicit liveness probes.
- The `client` service will not start or route traffic until `server` passes its Actuator healthcheck (`http://localhost:8080/actuator/health`).

### 5. Memory & CPU Governors
- Configured in `docker-compose.prod.yml`:
  - `server`: Max 2.0 CPU cores, 1536 MB RAM limit, 512 MB reservation.
  - `client`: Max 1.0 CPU cores, 512 MB RAM limit, 128 MB reservation.

---

## 5. Deployment on Linux Cloud VPS (Ubuntu 22.04 / 24.04 LTS)

### Step 1: Install Docker on Host
```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Step 2: Clone and Configure
```bash
git clone https://github.com/aryacollege/campussphere.git /var/www/campussphere
cd /var/www/campussphere
cp .env.example .env
nano .env # Paste production credentials
```

### Step 3: Run with Production Compose Spec
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### Step 4: HTTPS with Let's Encrypt / Certbot (Recommended)
Add a Certbot sidecar or install Certbot on the host:
```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

---

## 6. Health & Diagnostic Endpoints

| Endpoint | Protocol | Purpose | Expected Output |
|---|---|---|---|
| `/actuator/health` | HTTP GET | Spring Boot Liveness / Readiness | `{"status":"UP"}` |
| `/actuator/info` | HTTP GET | Build & Git Version Metadata | JSON Metadata |
| `/actuator/metrics` | HTTP GET | JVM Memory, GC, Thread Statistics | Metric Telemetry |
| `/api/clubs` | HTTP GET | Live MongoDB Club Verification | 15 Club records |
| `/api/events` | HTTP GET | Live MongoDB Events Feed | Event records |

---

## 7. Zero-Downtime Rolling Updates

To deploy an update without dropping user connections:
```bash
git pull origin main
docker compose build
docker compose up -d --no-deps --build server
sleep 15
docker compose up -d --no-deps --build client
docker image prune -f
```
