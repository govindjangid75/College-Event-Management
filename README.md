<p align="center">
  <img src="https://img.shields.io/badge/CampusSphere-v1.0.0-blueviolet?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAyTDIgNy41bDEwIDUuNSAxMC01LjVMMTIgMnptMCAxMS41TDIgOC4ydjcuM2wxMCA1LjUgMTAtNS41VjguMkwxMiAxMy41eiIvPjwvc3ZnPg==" alt="CampusSphere" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21" />
</p>

<h1 align="center">🎓 CampusSphere — College Event Management System</h1>

<p align="center">
  <b>A full-stack, production-grade event management and club collaboration platform built for <br/>Arya College of Engineering & IT (ACEIT), Jaipur</b>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Setup</a> •
  <a href="#-api-reference">API</a> •
  <a href="#-team">Team</a>
</p>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-architecture)
- [Database Schema (ERD)](#-database-schema)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development Setup](#local-development-setup)
  - [Docker Deployment](#docker-deployment)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Venue Clash Detection Engine](#-venue-clash-detection-engine)
- [AICTE Activity Points System](#-aicte-activity-points-system)
- [Security Architecture](#-security-architecture)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Documentation](#-documentation)
- [Team](#-team)
- [License](#-license)

---

## 🎯 About the Project

**CampusSphere** is a comprehensive, next-generation college event management and student club collaboration platform developed as a PBL (Project-Based Learning) project at **Arya College of Engineering & IT (ACEIT), Jaipur**. The platform streamlines the complete lifecycle of campus events — from proposal and approval, through venue scheduling and conflict detection, to registration, QR-based attendance verification, Razorpay-powered payments, AICTE activity point tracking, certificate generation, and AI-powered student assistants.

### 🎯 Problem Statement

Colleges across India manage events through disconnected WhatsApp groups, Google Forms, and manual spreadsheets. This leads to:
- Double-booked venues and scheduling conflicts
- Zero real-time visibility into event registrations and capacity
- Manual attendance marking vulnerable to proxy entries
- No auditable AICTE activity point trail for students
- Poor financial tracking for club treasuries

**CampusSphere solves all of these** with a unified, role-based web platform with real-time venue clash detection, QR-verified gate entry, and automated certificate and AICTE transcript generation.

---

## ✨ Features

### 🏠 Student Experience
- **Animated 3D Campus Explorer** — Interactive Three.js campus map with building hover and click navigation
- **Smart Event Discovery** — Browse, search, and filter events by category, club, date, and capacity
- **One-Click Registration** — Instant event registration with real-time capacity tracking
- **QR-Based Digital Passes** — Auto-generated QR passes for verified gate entry (anti-proxy)
- **Certificate Portfolio** — Download participation and merit certificates with unique verification codes
- **AICTE Activity Points Dashboard** — Track cumulative activity points across 7 AICTE domains
- **AI Campus Concierge Chatbot** — Ask questions about events, venues, rules, and campus life
- **Student Suggestions System** — Submit anonymous suggestions and feature requests to clubs

### 🎪 Club Admin Panel
- **Event Proposal & Lifecycle** — Create event proposals with full metadata (venue, budget, capacity, timeline)
- **Kanban Event Board** — Track events through PROPOSED → APPROVED → LIVE → COMPLETED → ARCHIVED stages
- **Club Treasury & Ledger** — Track income (ticket sales, sponsorships) and expenses with financial audit trail
- **Member Management** — Accept/reject club membership applications with role-based access
- **Attendance Scanner** — Real-time QR code scanning for verified gate entry/exit
- **Feedback Analytics** — Aggregated sentiment analysis and rating heatmaps per event
- **Payout Settlement Requests** — File payout requests from club treasury to college finance

### 👑 Super Admin (Dean/Principal)
- **Global Dashboard** — Bird's-eye view of all clubs, events, registrations, and financial health
- **Event Approval Workflow** — Approve or reject club event proposals with comments
- **Venue Conflict Audit** — System-wide venue utilization heatmap and overlap alerts
- **Financial Audit Trail** — Cross-club financial transparency with exportable reports
- **AICTE Compliance Monitor** — Institutional compliance tracking for accreditation documentation

### 🏗️ Infrastructure
- **Venue Clash Detection Engine** — Automatic 30-minute buffer zone enforcement between back-to-back bookings
- **Role-Based Access Control** — Student, Club President, Club Treasurer, Super Admin hierarchical permissions
- **Razorpay Payment Gateway** — Secure ticket payments with webhook-verified settlements
- **Docker Multi-Stage Deployment** — Production-ready containerized deployment with health checks
- **CI/CD Pipeline** — GitHub Actions automated build, test, and deploy pipeline
- **MongoDB Atlas Cloud** — Fully managed, scalable NoSQL database with automated backups

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|:---|:---|:---|
| **React** | 19.0 | Component-based UI framework |
| **TypeScript** | 5.7 | Type-safe JavaScript superset |
| **Vite** | 6.2 | Lightning-fast build tool and dev server |
| **React Router** | 7.2 | Client-side routing and navigation |
| **Three.js** | 0.186 | 3D campus explorer and interactive visualizations |
| **Lucide React** | 0.475 | Beautiful, consistent icon library |
| **QRCode.react** | 4.2 | QR code generation for digital event passes |
| **Canvas Confetti** | 1.9 | Celebration animations on successful actions |
| **CSS3** | — | Custom design system with glassmorphism, gradients, and dark mode |

### Backend
| Technology | Version | Purpose |
|:---|:---|:---|
| **Java** | 21 (LTS) | Primary backend language |
| **Spring Boot** | 3.3.4 | Enterprise application framework |
| **Spring Data MongoDB** | — | MongoDB ODM with repository pattern |
| **Spring Validation** | — | Bean validation and input sanitization |
| **Spring Actuator** | — | Health checks, metrics, and monitoring |
| **Lombok** | — | Boilerplate reduction for models/DTOs |
| **Maven** | — | Build automation and dependency management |

### Database & Cloud
| Technology | Purpose |
|:---|:---|
| **MongoDB Atlas** | Fully managed cloud NoSQL database |
| **MongoDB Compass** | GUI for database inspection and queries |

### DevOps & Deployment
| Technology | Purpose |
|:---|:---|
| **Docker** | Multi-stage containerized builds |
| **Docker Compose** | Multi-service orchestration (frontend + backend) |
| **NGINX** | Reverse proxy and static file serving |
| **GitHub Actions** | CI/CD pipeline for automated builds and tests |
| **Spring Boot Actuator** | Kubernetes-ready liveness and readiness probes |

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                         │
│   React 19 + TypeScript + Vite + Three.js + React Router        │
│   ┌──────────┬───────────┬───────────┬──────────┬─────────────┐ │
│   │ HomePage │ EventPage │ ClubAdmin │ SuperAdm │ 3D Explorer │ │
│   └──────────┴───────────┴───────────┴──────────┴─────────────┘ │
└─────────────────────────────┬───────────────────────────────────┘
                              │ REST API (HTTP/JSON)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   NGINX REVERSE PROXY (:80)                     │
│              Static Files + API Proxy Pass → :8080              │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                SPRING BOOT APPLICATION (:8080)                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                    Controller Layer                       │  │
│   │  EventCtrl │ ClubCtrl │ VenueCtrl │ FeedbackCtrl │ AiCtrl│  │
│   ├──────────────────────────────────────────────────────────┤  │
│   │                     Service Layer                        │  │
│   │  EventSvc │ ClubSvc │ VenueClashEngine │ CertificateSvc │  │
│   │  RegistrationSvc │ FeedbackSvc │ AiSvc │ DatabaseSeeder │  │
│   ├──────────────────────────────────────────────────────────┤  │
│   │                   Repository Layer                       │  │
│   │  EventRepo │ ClubRepo │ UserRepo │ VenueRepo │ + more    │  │
│   └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │ MongoDB Wire Protocol
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              MONGODB ATLAS (Cloud Cluster)                      │
│   Database: campussphere                                        │
│   Collections: users, events, clubs, registrations, venues,     │
│   certificates, club_ledger, feedbacks, suggestions, payouts    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💾 Database Schema

The application uses **11 MongoDB collections** modeled as Spring Data documents:

| Collection | Model Class | Description |
|:---|:---|:---|
| `users` | `User` | Student profiles, roles, enrollment data, AICTE points |
| `events` | `Event` | Event metadata, status (Kanban), venue, capacity, budget |
| `clubs` | `Club` | Club profiles, treasury balance, admin references |
| `registrations` | `Registration` | Event-student registration with QR code and attendance flags |
| `venues` | `Venue` | Campus venue master data (capacity, location, amenities) |
| `certificates` | `Certificate` | Auto-generated certificates with unique verification codes |
| `club_applications` | `ClubApplication` | Pending membership requests to clubs |
| `club_ledger` | `ClubLedgerEntry` | Financial transactions (income/expense) per club |
| `payout_requests` | `PayoutSettlementRequest` | Club treasury payout requests to college finance |
| `student_suggestions` | `StudentSuggestion` | Anonymous student suggestions and feature requests |
| `verified_feedbacks` | `VerifiedFeedback` | Post-event feedback with ratings and sentiment |

> 📄 For the full Entity Relationship Diagram with field-level details, see [`docs/ERD.md`](docs/ERD.md)

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Download |
|:---|:---|:---|
| **Node.js** | ≥ 18.x | [nodejs.org](https://nodejs.org/) |
| **Java JDK** | 21 (LTS) | [adoptium.net](https://adoptium.net/) |
| **Maven** | ≥ 3.9 | [maven.apache.org](https://maven.apache.org/) |
| **Docker** *(optional)* | ≥ 24.x | [docker.com](https://www.docker.com/) |
| **Git** | ≥ 2.40 | [git-scm.com](https://git-scm.com/) |

### Local Development Setup

**1. Clone the repository**

```bash
git clone https://github.com/govindjangid75/College-Event-Management.git
cd College-Event-Management
```

**2. Start the Backend (Spring Boot)**

```bash
cd server
./mvnw spring-boot:run
```

The backend starts on `http://localhost:8080`. The MongoDB Atlas connection is pre-configured with a shared development cluster.

**3. Start the Frontend (React + Vite)**

```bash
cd client
npm install
npm run dev
```

The frontend starts on `http://localhost:5173` with hot module reload enabled.

**4. Open in browser**

Navigate to `http://localhost:5173` — the app connects to the backend at `:8080` automatically.

### Docker Deployment

**One-command full-stack deployment:**

```bash
# Copy environment template
cp .env.example .env

# Build and start all services
docker compose up --build -d
```

This spins up:
- `campussphere-server` — Spring Boot backend on port `8080`
- `campussphere-client` — React frontend via NGINX on port `80`

**Production deployment with SSL:**

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

> See [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md) for detailed production deployment instructions.

---

## 🔐 Environment Variables

Create a `.env` file in the project root (use `.env.example` as template):

| Variable | Description | Default |
|:---|:---|:---|
| `MONGODB_URI` | MongoDB Atlas connection string | *(pre-configured dev cluster)* |
| `MONGODB_DATABASE` | Database name | `campussphere` |
| `SERVER_PORT` | Spring Boot server port | `8080` |
| `CLIENT_PORT` | NGINX frontend port | `80` |
| `RAZORPAY_KEY_ID` | Razorpay API key (test mode) | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret | *(see .env.example)* |
| `VENUE_SETUP_BUFFER` | Pre-event venue buffer (minutes) | `30` |
| `VENUE_CLEANUP_BUFFER` | Post-event venue cleanup buffer (minutes) | `30` |
| `JWT_SECRET` | JWT signing secret key | *(auto-generated)* |
| `JWT_EXPIRATION_MS` | JWT token expiry (milliseconds) | `86400000` (24h) |
| `CAMPUS_NAME` | Institution branding name | `Arya College of Engineering & IT` |

---

## 📁 Project Structure

```
College-Event-Management/
├── client/                          # React 19 Frontend (TypeScript + Vite)
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Campus3DExplorer.tsx      # Interactive Three.js campus map
│   │   │   ├── CampusConciergeChat.tsx   # AI-powered chatbot widget
│   │   │   ├── CreateEventModal.tsx      # Event creation form modal
│   │   │   ├── EventFeedbackModal.tsx    # Post-event feedback form
│   │   │   ├── EventRegistrationModal.tsx # Event registration flow
│   │   │   ├── Navbar.tsx                # Main navigation bar
│   │   │   ├── ProtectedRoute.tsx        # Auth guard wrapper
│   │   │   ├── RoleSwitcherBar.tsx       # Demo role switching toolbar
│   │   │   └── StudentSuggestionModal.tsx # Anonymous suggestion form
│   │   ├── pages/                   # Route-level page components
│   │   │   ├── HomePage.tsx              # Landing page with 3D explorer
│   │   │   ├── EventsPage.tsx            # Event discovery and search
│   │   │   ├── ClubsPage.tsx             # Club listing and browsing
│   │   │   ├── ClubDetailPage.tsx        # Individual club profile
│   │   │   ├── ClubAdminPage.tsx         # Club management dashboard
│   │   │   ├── SuperAdminPage.tsx        # Dean/Principal admin panel
│   │   │   ├── StudentProfilePage.tsx    # Student profile & AICTE points
│   │   │   ├── MyPassesPage.tsx          # QR digital passes portfolio
│   │   │   ├── CertificatesPage.tsx      # Certificate download center
│   │   │   ├── CertificateVerifyPage.tsx # Public certificate verification
│   │   │   ├── LoginPage.tsx             # Authentication login
│   │   │   └── RegisterPage.tsx          # Student registration
│   │   ├── context/                 # React Context providers
│   │   │   ├── AuthContext.tsx           # Authentication state management
│   │   │   ├── ClubContext.tsx           # Club data state management
│   │   │   └── ThemeContext.tsx          # Dark/light theme toggle
│   │   ├── services/                # API service layer
│   │   ├── data/                    # Seed data and constants
│   │   ├── types/                   # TypeScript type definitions
│   │   ├── App.tsx                  # Root app with routing
│   │   └── index.css                # Global design system stylesheet
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                          # Spring Boot 3.3.4 Backend (Java 21)
│   ├── src/main/java/com/aryacollege/campussphere/
│   │   ├── CampusSphereApplication.java  # Spring Boot entry point
│   │   ├── config/
│   │   │   └── CorsConfig.java           # CORS security configuration
│   │   ├── controller/              # REST API endpoints
│   │   │   ├── EventController.java      # /api/events
│   │   │   ├── ClubController.java       # /api/clubs
│   │   │   ├── RegistrationController.java  # /api/registrations
│   │   │   ├── VenueController.java      # /api/venues
│   │   │   ├── CertificateController.java   # /api/certificates
│   │   │   ├── FeedbackController.java   # /api/feedbacks
│   │   │   ├── AiController.java         # /api/ai
│   │   │   └── SuperAdminAuditController.java  # /api/admin/audit
│   │   ├── dto/                     # Data Transfer Objects
│   │   │   ├── EventProposalDto.java
│   │   │   ├── RegistrationRequestDto.java
│   │   │   ├── VenueClashCheckDto.java
│   │   │   ├── VenueClashResultDto.java
│   │   │   ├── FeedbackSubmissionDto.java
│   │   │   ├── AiChatDto.java
│   │   │   └── ... (11 DTOs total)
│   │   ├── model/                   # MongoDB document models
│   │   │   ├── User.java
│   │   │   ├── Event.java
│   │   │   ├── Club.java
│   │   │   ├── Registration.java
│   │   │   ├── Venue.java
│   │   │   ├── Certificate.java
│   │   │   ├── ClubLedgerEntry.java
│   │   │   └── ... (11 models total)
│   │   ├── repository/              # Spring Data MongoDB repositories
│   │   └── service/                 # Business logic layer
│   │       ├── EventService.java
│   │       ├── ClubService.java
│   │       ├── RegistrationService.java
│   │       ├── VenueClashEngineService.java  # ⚡ Core venue conflict detection
│   │       ├── CertificateService.java
│   │       ├── FeedbackService.java
│   │       ├── AiService.java               # AI chatbot responses
│   │       └── DatabaseSeederService.java   # 50+ seed records on first boot
│   ├── pom.xml                      # Maven dependencies
│   └── Dockerfile                   # Multi-stage Java 21 container build
│
├── docs/                            # Project documentation
│   ├── PRD.md                       # Product Requirements Document
│   ├── SRS.md                       # Software Requirements Specification
│   ├── TRD.md                       # Technical Requirements Document
│   ├── ERD.md                       # Entity Relationship Diagram
│   ├── API_SPECIFICATION.md         # Complete REST API documentation
│   ├── SECURITY_ARCHITECTURE.md     # Security design and threat model
│   ├── DEPLOYMENT_GUIDE.md          # Production deployment guide
│   ├── DEVELOPMENT_ROADMAP.md       # 12-week sprint breakdown
│   └── AICTE_ACTIVITY_POINTS_SPEC.md # AICTE points calculation spec
│
├── .github/workflows/              # CI/CD pipeline
│   └── ci-cd.yml                    # GitHub Actions workflow
├── docker-compose.yml               # Development compose file
├── docker-compose.prod.yml          # Production compose with SSL
├── .env.example                     # Environment variable template
├── .gitignore
└── README.md                        # ← You are here
```

---

## 📡 API Reference

The backend exposes the following REST API endpoints:

### Events API
| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/events` | List all events (with optional filters) |
| `GET` | `/api/events/{id}` | Get event details by ID |
| `POST` | `/api/events` | Create a new event proposal |
| `PUT` | `/api/events/{id}` | Update event details |
| `PUT` | `/api/events/{id}/status` | Update Kanban status (approve/reject/archive) |
| `DELETE` | `/api/events/{id}` | Delete an event |

### Clubs API
| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/clubs` | List all clubs |
| `GET` | `/api/clubs/{id}` | Get club details with members |
| `POST` | `/api/clubs` | Create a new club |
| `POST` | `/api/clubs/{id}/join` | Apply for club membership |
| `PUT` | `/api/clubs/{id}/members/{userId}` | Accept/reject membership |

### Registration & Attendance
| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/registrations` | Register for an event |
| `GET` | `/api/registrations/user/{userId}` | Get user's registrations |
| `POST` | `/api/registrations/verify-gate` | QR gate entry verification |
| `GET` | `/api/registrations/event/{eventId}` | List all registrations for an event |

### Venues & Clash Detection
| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/venues` | List all campus venues |
| `POST` | `/api/venues/check-clash` | Check venue availability with buffer zones |

### Certificates
| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/certificates/user/{userId}` | Get user's certificates |
| `GET` | `/api/certificates/verify/{code}` | Public certificate verification |
| `POST` | `/api/certificates/generate/{eventId}` | Batch generate event certificates |

### Feedback & Suggestions
| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/feedbacks` | Submit event feedback with rating |
| `GET` | `/api/feedbacks/event/{eventId}/summary` | Aggregated feedback analytics |
| `POST` | `/api/suggestions` | Submit anonymous student suggestion |

### AI Chatbot
| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/ai/chat` | Send message to AI campus concierge |
| `POST` | `/api/ai/draft-event` | AI-assisted event proposal generation |
| `GET` | `/api/ai/aicte-transcript/{userId}` | Generate AICTE activity transcript |

> 📄 For complete request/response schemas, see [`docs/API_SPECIFICATION.md`](docs/API_SPECIFICATION.md)

---

## ⚡ Venue Clash Detection Engine

One of CampusSphere's core innovations is the **Venue Clash Detection Engine** — a scheduling conflict prevention system that ensures no two events can overlap at the same venue, with configurable setup and cleanup buffer zones.

### How It Works

```
Event A                          Event B (CLASH!)
├── Setup Buffer (30 min) ──┐    ┌── Setup Buffer (30 min)
│                           │    │
├── Event Start ────────────┤    ├── Event Start
│   [Event Duration]        │    │   [Event Duration]
├── Event End ──────────────┤    ├── Event End
│                           │    │
├── Cleanup Buffer (30 min)─┘    └── Cleanup Buffer (30 min)
│                           │
│  ◄── PROTECTED ZONE ──►  │
│     (No overlaps allowed) │
```

- **Configurable buffers**: `VENUE_SETUP_BUFFER` and `VENUE_CLEANUP_BUFFER` (default: 30 minutes each)
- **Real-time checking**: `POST /api/venues/check-clash` validates before event creation
- **Bulk analysis**: Super Admin can view venue utilization heatmaps across all venues

---

## 🏅 AICTE Activity Points System

CampusSphere implements the **AICTE Activity Points Framework** for tracking student extra-curricular engagement across 7 mandated domains:

| Domain | Points Range | Examples |
|:---|:---|:---|
| Sports & Games | 25–50 | Inter-college tournaments, annual sports meet |
| Cultural Activities | 25–50 | Music fest, drama competitions, art exhibitions |
| Technical Activities | 50–100 | Hackathons, coding contests, paper presentations |
| Social Outreach | 25–50 | NSS camps, blood donation drives, tree plantation |
| Entrepreneurship | 50–100 | Startup weekends, E-Cell events, pitch competitions |
| Professional Self-Initiatives | 25–75 | Certifications, MOOCs, conference presentations |
| Leadership & Management | 25–50 | Club president roles, event organizing committee |

> **Graduation requirement**: Students need **≥ 100 activity points** (AICTE mandate) for degree completion.

> 📄 See [`docs/AICTE_ACTIVITY_POINTS_SPEC.md`](docs/AICTE_ACTIVITY_POINTS_SPEC.md) for the full specification.

---

## 🔒 Security Architecture

- **Role-Based Access Control (RBAC)** — 4-tier permission hierarchy (Student → Club Member → Club Admin → Super Admin)
- **JWT Token Authentication** — Stateless auth with 24-hour expiry and secure HTTP-only cookies
- **CORS Policy** — Strict origin whitelisting for cross-domain API requests
- **Input Validation** — Spring Bean Validation on all DTOs with sanitized error responses
- **Rate Limiting** — API rate limiting to prevent abuse and DDoS
- **MongoDB Atlas Security** — IP whitelisting, TLS encryption in transit, encrypted at rest

> 📄 See [`docs/SECURITY_ARCHITECTURE.md`](docs/SECURITY_ARCHITECTURE.md) for the complete security design and threat model.

---

## 🔄 CI/CD Pipeline

The project uses **GitHub Actions** for continuous integration and deployment:

```yaml
Trigger: Push to main / Pull Request
├── ✅ Checkout code
├── ✅ Set up Java 21
├── ✅ Cache Maven dependencies
├── ✅ Build Spring Boot backend (mvn clean package)
├── ✅ Run backend unit tests
├── ✅ Set up Node.js 18
├── ✅ Install frontend dependencies (npm ci)
├── ✅ Build React frontend (npm run build)
├── ✅ Run TypeScript type checking
└── ✅ Build Docker images (multi-stage)
```

---

## 📚 Documentation

| Document | Description |
|:---|:---|
| [`docs/PRD.md`](docs/PRD.md) | Product Requirements Document — scope, user personas, success metrics |
| [`docs/SRS.md`](docs/SRS.md) | Software Requirements Specification — functional and non-functional requirements |
| [`docs/TRD.md`](docs/TRD.md) | Technical Requirements Document — architecture decisions and stack rationale |
| [`docs/ERD.md`](docs/ERD.md) | Entity Relationship Diagram — complete database schema and relationships |
| [`docs/API_SPECIFICATION.md`](docs/API_SPECIFICATION.md) | REST API documentation with request/response schemas |
| [`docs/SECURITY_ARCHITECTURE.md`](docs/SECURITY_ARCHITECTURE.md) | Security design, RBAC model, and threat analysis |
| [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md) | Step-by-step production deployment guide |
| [`docs/DEVELOPMENT_ROADMAP.md`](docs/DEVELOPMENT_ROADMAP.md) | 12-week sprint plan and milestone tracker |
| [`docs/AICTE_ACTIVITY_POINTS_SPEC.md`](docs/AICTE_ACTIVITY_POINTS_SPEC.md) | AICTE activity points calculation specification |

---

## 👥 Team

This project was developed as a **PBL (Project-Based Learning)** initiative at **Arya College of Engineering & IT (ACEIT), Jaipur** by the following team:

| Name | Role | GitHub | Responsibilities |
|:---|:---|:---|:---|
| **Govind Jangid** | Frontend Lead | [@govindjangid75](https://github.com/govindjangid75) | React UI components, routing, 3D campus explorer, theme system, responsive design |
| **Garvita Jain** | Backend Lead | [@garvitajain75](https://github.com/garvitajain75) | Spring Boot REST APIs, authentication, venue clash engine, security architecture |
| **Ayushi Garg** | Payments & Ticketing | [@Ayushigarg03](https://github.com/Ayushigarg03) | Razorpay integration, club treasury ledger, iText PDF ticket generation |
| **Ankit Yadav** | Admin & DevOps | [@ankitydv5105-lang](https://github.com/ankitydv5105-lang) | Admin dashboards, QR scanner, Docker containerization, NGINX, CI/CD pipeline |
| **Anshika Pathak** | Database & Verification | [@AnshikaP0841](https://github.com/AnshikaP0841) | MongoDB schema design, database seeder, attendance verification, AICTE points, AI chatbot |

---

## 🏫 Institution

**Arya College of Engineering & IT (ACEIT)**  
SP-42, RIICO Industrial Area, Kukas, Jaipur, Rajasthan 302028, India  
Affiliated to Rajasthan Technical University (RTU), Kota  
AICTE Approved | NAAC Accredited

---

## 📄 License

This project is developed for academic purposes as part of the PBL curriculum at ACEIT, Jaipur.  
© 2026 CampusSphere Team. All rights reserved.

---

<p align="center">
  <b>Built with ❤️ by the CampusSphere Team at Arya College, Jaipur</b>
  <br/>
  <sub>⭐ If this project helped you, consider giving it a star on GitHub!</sub>
</p>
