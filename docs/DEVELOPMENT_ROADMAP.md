# CampusSphere: Engineering Development Roadmap
**Execution Methodology:** Phased Modular Engineering with Test-Driven Verification  
**Project:** CampusSphere ? Arya College Platform  
**Version:** 2.0.0-PROD  
**Status:** 100% COMPLETED & VERIFIED ON LIVE MONGODB ATLAS  

---

## 1. Execution Principles

To ensure production-grade software craftsmanship:
1. Every phase delivers a fully functional, self-contained slice of the application.
2. Architecture strictly uses Spring Boot (Java 21) backend connected to MongoDB Atlas, with pure Vanilla CSS glassmorphic tokens on the React frontend.
3. Rigorous verification checks pass with real database persistence.

---

## 2. Phased Roadmap Overview & Completion Status

```
[COMPLETED] Phase 1: Foundation, Data Models & Authentication
      |
[COMPLETED] Phase 2: Master 15 Clubs Directory & Dedicated Treasury
      |
[COMPLETED] Phase 3: Event Engine, Proposal Workflow & Venue Clash Buffer
      |
[COMPLETED] Phase 4: Solo & Team Registration Engine + Anti-Screenshot Dynamic QR
      |
[COMPLETED] Phase 5: Razorpay Gateway, Webhook Idempotency & Split Accounting
      |
[COMPLETED] Phase 6: Live Venue Gate Attendance Scanner (PWA)
      |
[COMPLETED] Phase 7: 5-Factor Verified Feedback & "You Said, We Did" Kanban Board
      |
[COMPLETED] Phase 8: Verifiable E-Certificates & AICTE Activity Points Engine
      |
[COMPLETED] Phase 9: AI Copilot Suite (Recommender, Agenda Copilot, Sentiment Clustering, Chatbot)
      |
[COMPLETED] Phase 10: Interactive 3D Campus Digital Twin (Three.js)
      |
[COMPLETED] Phase 11: Production Containerization & DevOps (Docker, Nginx, Compose, CI/CD)
```

---

## 3. Detailed Phase Specifications

### Phase 1: Foundation, Data Models & Authentication
* **Deliverables:**
  - Full-stack project structure initialization (React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons + Backend Server).
  - TypeScript interfaces for all system entities (`User`, `Club`, `Event`, `Venue`, `Registration`, `Payment`, `Attendance`, `Feedback`, `Certificate`).
  - MongoDB connection setup with indexing scripts.
  - JWT Authentication (Access token + HttpOnly refresh token rotation).
  - Role-based authorization guard (`STUDENT`, `CLUB_ADMIN`, `SUPER_ADMIN`).
  - Polished modern UI for Register, Login, and Role-specific Navigation Bar.
* **Verification Criteria:**
  - Successful user registration with Arya College roll number.
  - Login returns valid JWT and role claims; protected routes deny unauthorized access.

---

### Phase 2: Master 15 Clubs Directory & Dedicated Treasury
* **Deliverables:**
  - Database seeder initializing all 15 Arya College clubs (Cipher Coding, ACEIT Hackathons, Dance, Drones, Robotics, E-Sports, etc.).
  - Club Showcase catalog with category filters, member rosters, faculty in-charge profiles, and social links.
  - Club Admin Management Console: update club profiles, view executive leads.
  - Dedicated Club Treasury data models: balance tracking, payout UPI IDs, and ledger initialization.
* **Verification Criteria:**
  - All 15 clubs displayed with verified branding; club admin can only modify their assigned club.

---

### Phase 3: Event Engine, Proposal Workflow & Venue Clash Buffer
* **Deliverables:**
  - Campus venues catalog (Main Auditorium, Seminar Hall A/B, Labs, Central Lawn) with seat capacities and facilities.
  - Event creation wizard for Club Admins (Title, Category, Tags, Solo/Team mode, Free/Paid, Max Capacity, AICTE points).
  - **Venue Buffer Collision Engine:** Enforces 30-min setup buffer before and 30-min cleanup buffer after every event.
  - Event approval queue for Super Admin (Dean/HOD) with Approve/Reject modal and feedback notes.
* **Verification Criteria:**
  - Overlapping venue bookings within the buffer window are rejected with informative conflict alerts.
  - Event lifecycle transitions correctly: `DRAFT` $\rightarrow$ `PENDING_APPROVAL` $\rightarrow$ `APPROVED`.

---

### Phase 4: Solo & Team Registration Engine + Anti-Screenshot Dynamic QR
* **Deliverables:**
  - Atomic capacity locking to eliminate overbooking race conditions.
  - Solo event registration flow.
  - **Hackathon & Esports Team Registration:** Team creation, 6-character team passcodes (e.g. `ACE-789X`), roster join modal.
  - **Anti-Screenshot Dynamic Rolling QR Engine:** 30-second rotating HMAC-SHA256 token with countdown ring and holographic watermark.
  - "My Tickets / Passes" mobile-responsive dashboard for students.
* **Verification Criteria:**
  - Concurrent registrations do not exceed max capacity.
  - Dynamic QR token recalculates every 30 seconds; expired tokens fail validation.

---

### Phase 5: Razorpay Gateway, Webhook Idempotency & Split Accounting
* **Deliverables:**
  - Razorpay order generation mapped directly to the organizing club.
  - Client checkout modal simulation and live gateway integration.
  - Server-side HMAC signature verification.
  - Dedicated Club Ledger credit: proceeds credited to organizer club balance.
  - Super Admin Central Financial Audit Console: campus gross revenue, club-by-club financial splits, refund status, and transaction ledger.
* **Verification Criteria:**
  - Payment verified server-side; club balance increases; Super Admin audit console reflects transaction in real time.

---

### Phase 6: Live Venue Gate Attendance Scanner (PWA)
* **Deliverables:**
  - In-app camera QR scanner utilizing device webcam/smartphone camera.
  - Token decryption, timestamp validation ($\pm 30$s skew), and event match check.
  - **Single-Scan Guarantee:** Checks duplicate entries; emits loud audible alarm and high-visibility red banner on duplicate scans.
  - Live venue attendance counter and attendee roster dashboard.
* **Verification Criteria:**
  - Valid dynamic QR scan approves attendee; immediate second scan is rejected with timestamp proof.

---

### Phase 7: 5-Factor Verified Feedback & "You Said, We Did" Kanban Board
* **Deliverables:**
  - Strict gatekeeper logic: Feedback unlocked *only* for verified attendees of `COMPLETED` events.
  - 5-Dimensional evaluation form (Content, Organization, Speaker, Venue, Value).
  - Public Suggestion Board with peer upvoting.
  - Club Admin "You Said, We Did" Kanban board: transition suggestions (`SUBMITTED` $\rightarrow$ `UNDER_REVIEW` $\rightarrow$ `PLANNED` $\rightarrow$ `IMPLEMENTED`) with proof notes/photos.
* **Verification Criteria:**
  - Unregistered or unverified students are blocked from submitting feedback; verified reviews appear with "Verified Attendee" badge.

---

### Phase 8: Verifiable E-Certificates & AICTE Activity Points Engine
* **Deliverables:**
  - High-resolution vector PDF certificate generator with Arya College crest, club badge, and Dean signature.
  - Public `/verify/:certId` verification portal displaying certificate authenticity via SHA-256 seal.
  - 1-Click "Add to LinkedIn Licenses & Certifications" button.
  - **AICTE Activity Points Engine:** Auto-credits points upon verified attendance and exports the official Activity Points Transcript PDF.
* **Verification Criteria:**
  - Scanning certificate QR code loads public verification page with matching details and valid cryptographic seal.

---

### Phase 9: AI Copilot Suite
* **Deliverables:**
  - **Hybrid Event Recommender:** Matches student department, semester, and interests to events.
  - **Club Event Copilot:** Generates event titles, agendas, prerequisites, and rules from prompts.
  - **NLP Sentiment & Suggestion Clustering:** Auto-summarizes reviews and clusters suggestions by topic.
  - **Campus Concierge Chatbot:** Real-time conversational assistant answering student questions in English/Hinglish.
* **Verification Criteria:**
  - AI recommender outputs personalized scores; Copilot generates complete event agendas; Chatbot responds to campus queries.

---

### Phase 10: Interactive 3D Campus Digital Twin (Three.js)
* **Deliverables:**
  - Low-poly 3D canvas of Arya College campus landmarks (Academic Blocks, Auditorium, Innovation Hub, Sports Complex).
  - Interactive pulsing neon beacons on buildings hosting live/upcoming events.
  - Building orbit navigation and event details drawer.
  - WebGL fallback and responsive HUD controls.
* **Verification Criteria:**
  - 3D campus renders smoothly at > 50 FPS on mobile and desktop; all 10 phases integrate seamlessly.

---

### Phase 11: Production Containerization & DevOps Orchestration
* **Deliverables:**
  - **Multi-Stage Spring Boot Dockerfile:** Java 21 Temurin Alpine runtime, non-root system user, container memory boundaries, and Actuator health check probes.
  - **Hardened Nginx Client Dockerfile:** Alpine Nginx image with SPA client-side routing fallback, dynamic Gzip compression, and HTTP reverse proxy for `/api/`.
  - **Multi-Container Docker Compose (`docker-compose.yml` & `docker-compose.prod.yml`):** Inter-container DNS networking, resource limits (CPU/RAM), restart policies, and healthcheck dependencies.
  - **CI/CD Quality Pipeline (`.github/workflows/ci-cd.yml`):** Automated TypeScript typechecking, Vite bundle compilation, Maven package verification, and Docker build test.
  - **Production Deployment Guide (`docs/DEPLOYMENT_GUIDE.md`):** Complete documentation for running locally, deploying to Linux cloud VPS, configuring SSL/Certbot, and managing environment secrets.
* **Verification Criteria:**
  - Multi-stage Dockerfiles build successfully; Actuator endpoints report health status; zero compilation errors across TypeScript and Java 21.

---

## 4. Implementation & Live Verification Status Matrix

| Phase | Milestone Name | Backend Stack | Frontend Interface | Verification Status |
|:---:|---|---|---|:---:|
| **1** | Foundation & Auth | Spring Boot + MongoDB Atlas | React 19 + RoleSwitcherBar | **100% Verified** |
| **2** | Master 15 Clubs Directory | `ClubController.java` + Atlas | `ClubsPage.tsx` + `ClubDetailPage.tsx` | **100% Verified** |
| **3** | Event Engine & Buffer Clash | `EventService.java` (30-min buffer) | `CreateEventModal.tsx` + `EventsPage.tsx` | **100% Verified** |
| **4** | Registration & Dynamic QR | `RegistrationService.java` | `EventRegistrationModal.tsx` + `MyPassesPage.tsx` | **100% Verified** |
| **5** | Split Treasury & Dean Audit | `SuperAdminAuditController.java` | `SuperAdminPage.tsx` + `ClubAdminPage.tsx` | **100% Verified** |
| **6** | Live Attendance Scanner | Gate Verification Engine | `ClubAdminPage.tsx` Scanner Tab | **100% Verified** |
| **7** | Verified Feedback & Kanban | `FeedbackController.java` | `EventFeedbackModal.tsx` + "You Said, We Did" | **100% Verified** |
| **8** | E-Certificates & AICTE Points | `CertificateController.java` | `CertificatesPage.tsx` + `/verify/:certId` | **100% Verified** |
| **9** | Campus AI Copilot Suite | `AiController.java` | SphereAI Copilot & Concierge Chatbot | **100% Verified** |
| **10** | 3D Campus Digital Twin | Three.js WebGL Spatial Simulation | `Campus3DExplorer.tsx` | **100% Verified** |
| **11** | Production Docker & DevOps | Spring Boot Actuator + JRE 21 Alpine | Nginx Alpine SPA + GitHub Actions CI/CD | **100% Verified** |

*All 11 phases fully delivered, interconnected, and verified against MongoDB Atlas cluster `event-management.o8uyxsv.mongodb.net/campussphere`.*
