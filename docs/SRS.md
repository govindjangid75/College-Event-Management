# CampusSphere: Software Requirements Specification (SRS)
**Standard:** IEEE Std 830-1998 Format  
**Project:** CampusSphere ? Arya College Event, Club, Payment & Engagement Ecosystem  
**Version:** 1.0.0-PROD  
**Status:** Approved  

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) establishes the complete functional and non-functional requirements for the **CampusSphere** platform. It serves as the authoritative agreement between project stakeholders, software engineers, testers, and academic administrators of **Arya College of Engineering & IT (ACEIT), Jaipur**.

### 1.2 Scope
CampusSphere delivers a full-stack, enterprise-grade web application to govern all student club activities, college events, venue scheduling, fee collections, ticket check-in verification, peer feedback, e-certificates, and AICTE activity point tracking.

### 1.3 Definitions, Acronyms, and Abbreviations
* **RBAC:** Role-Based Access Control (`STUDENT`, `CLUB_ADMIN`, `SUPER_ADMIN`).
* **TOTP:** Time-based One-Time Password / Rolling Cryptographic Token.
* **HMAC:** Hash-based Message Authentication Code (SHA-256).
* **AICTE:** All India Council for Technical Education.
* **RTU:** Rajasthan Technical University (Affiliating university of Arya College).
* **JWT:** JSON Web Token (RFC 7519).
* **Kanban:** Visual board for managing the lifecycle of student suggestions (`SUBMITTED` $\rightarrow$ `UNDER_REVIEW` $\rightarrow$ `PLANNED` $\rightarrow$ `IMPLEMENTED`).

### 1.4 References
* IEEE Std 830-1998: Recommended Practice for Software Requirements Specifications.
* RFC 7519: JSON Web Token (JWT).
* RFC 6238: TOTP: Time-Based One-Time Password Algorithm.
* AICTE Activity Points Norms for Degree Honors.

---

## 2. Overall Description

### 2.1 Product Perspective
CampusSphere operates as a self-contained, micro-modular web platform integrating with external services:
* **Payment Gateway:** Razorpay API & Webhook Dispatcher.
* **Cloud Storage:** Amazon S3 / Cloudinary for banners, proof images, and PDF certificates.
* **AI Engine:** LLM inference for event generation, sentiment analysis, and recommendation matching.
* **Client Devices:** Progressive Web App (PWA) compatible with Android, iOS, Windows, and macOS browsers.

```
       +-------------------------------------------------------------+
       |                     CAMPUSSPHERE CLIENT                     |
       +-------------------------------------------------------------+
                                      |
                           HTTPS / REST / WebSocket
                                      |
                                      v
       +-------------------------------------------------------------+
       |               API GATEWAY & SPRING SECURITY                 |
       +-------------------------------------------------------------+
                                      |
         +----------------------------+----------------------------+
         |                            |                            |
         v                            v                            v
+------------------+         +------------------+         +------------------+
| Mongo Database   |         | External APIs    |         | AI Inference     |
| (Collections)    |         | (Razorpay, S3)   |         | (Copilot Engine) |
+------------------+         +------------------+         +------------------+
```

### 2.2 User Classes and Roles
1. **STUDENT:**
   - Enrolled students of Arya College.
   - Discovers events, joins teams, registers, pays fees, accesses rolling QR passes, checks attendance, earns AICTE points, downloads certificates, and submits verified feedback.
2. **CLUB_ADMIN (Club Executive Lead / Faculty Coordinator):**
   - Authorized coordinators of any of the 15 verified Arya College clubs.
   - Drafts events, books venues, views registrations, operates the live gate QR scanner, tracks dedicated club finances, and manages the "You Said, We Did" Kanban board.
3. **SUPER_ADMIN (Dean / HOD / Principal):**
   - Senior administrative authorities.
   - Approves or rejects event proposals, resolves venue clashes, monitors campus-wide financial health, audits transactions, and signs off on official AICTE transcripts.

### 2.3 Operating Environment
* **Server Environment:** Java 21 / Node.js 24 runtime, Docker containerized, Linux/Windows host.
* **Database:** MongoDB 7.0+ (Replica set supporting multi-document ACID transactions).
* **Client Browser:** Chromium (Chrome, Edge, Brave > v100), Safari > v15, Firefox > v100 with WebGL support for Three.js.

### 2.4 Design and Implementation Constraints
* **Immutable Accounting:** Club Admins must never be permitted to alter ledger balances directly.
* **Attendance Gating:** Feedback submission must be physically impossible unless attendance has been verified by the gate scanner.
* **No Screenshot Forwarding:** QR codes must continuously cycle their HMAC cryptographic token every 30 seconds.

---

## 3. Specific Functional Requirements (FR)

### 3.1 Authentication & Role Management (FR-1)
* **FR-1.1:** The system shall allow students to register with their verified Arya College roll number (e.g. `22EACIT089`), institutional email, branch, and semester.
* **FR-1.2:** The system shall enforce BCrypt hashing (strength 12) for all user passwords.
* **FR-1.3:** The system shall issue dual JWTs upon login: a 15-minute access token and a 7-day refresh token stored in an HttpOnly secure cookie.
* **FR-1.4:** The system shall enforce role-based endpoint authorization using Spring Security / middleware interceptors.

### 3.2 Master Clubs & Dedicated Treasury (FR-2)
* **FR-2.1:** The system shall initialize with all 15 official Arya College clubs pre-seeded with custom logos, faculty leads, and student coordinator profiles.
* **FR-2.2:** Each club shall possess a dedicated, isolated sub-ledger tracking: `Total Revenue`, `Available Balance`, `Pending Settlement`, and `Payout Destination`.
* **FR-2.3:** Club Admins shall only be permitted to view and manage their assigned club.
* **FR-2.4:** Super Admins shall have a centralized view of all 15 club ledgers simultaneously.

### 3.3 Event Proposal, Approval & Lifecycle (FR-3)
* **FR-3.1:** Club Admins shall be able to draft events specifying: Title, Category, Tags, Schedule, Venue, Solo/Team mode, Ticket Pricing (Free or Paid), Max Capacity, and AICTE Points.
* **FR-3.2:** Submitted proposals shall enter `PENDING_APPROVAL` status.
* **FR-3.3:** Super Admins can `APPROVE` or `REJECT` events with mandatory review notes.
* **FR-3.4:** An approved event automatically transitions through states: `APPROVED` $\rightarrow$ `LIVE` $\rightarrow$ `COMPLETED`.

### 3.4 Venue Booking & Buffer Conflict Engine (FR-4)
* **FR-4.1:** Campus venues (Main Auditorium, Seminar Hall A/B, Central Lawn, Labs 1-4) shall enforce strict capacity limits.
* **FR-4.2:** The conflict engine shall mandate a **30-minute setup buffer before** and a **30-minute teardown buffer after** every event.
* **FR-4.3:** Overlapping bookings within the extended window $[T_{start} - 30\text{min}, T_{end} + 30\text{min}]$ shall be blocked automatically with conflict alerts.

### 3.5 Solo & Team Registration Engine (FR-5)
* **FR-5.1:** Solo events shall register the individual student atomically decrementing remaining capacity.
* **FR-5.2:** Team events (Hackathons & Esports) shall allow team captains to name their squad and generate a unique 6-character Team Passcode (e.g., `ACE-892K`).
* **FR-5.3:** Teammates shall be added by entering the Team Passcode; registration finalizes only when minimum squad size is satisfied.
* **FR-5.4:** A unique composite index on `{ event_id: 1, user_id: 1 }` shall strictly prevent duplicate registrations.

### 3.6 Payments & Split Ledger Accounting (FR-6)
* **FR-6.1:** Paid events shall generate a Razorpay order mapped directly to the organizing club.
* **FR-6.2:** The backend shall verify payment authenticity by calculating and matching the server-side HMAC-SHA256 signature before issuing any ticket.
* **FR-6.3:** Verified payments shall immediately credit the organizer club's ledger balance while recording an immutable audit entry visible to Super Admins.

### 3.7 Anti-Screenshot Dynamic Rolling QR Engine (FR-7)
* **FR-7.1:** For every confirmed registration, the system shall compute a dynamic rolling token:
  $$\text{Token} = \text{HMAC-SHA256}(\text{registration\_id} + \text{user\_id} + \lfloor \text{timestamp} / 30 \rfloor, \text{SECRET})$$
* **FR-7.2:** The client interface shall render the QR code with an active 30-second countdown ring and an animated holographic watermark.
* **FR-7.3:** Screenshots or static copies captured and presented after the 30-second window expires shall be rejected by the gate scanner.

### 3.8 Live Venue Attendance Scanner (FR-8)
* **FR-8.1:** Club Admins shall have an in-app camera scanner accessible via smartphone browser or webcam.
* **FR-8.2:** Upon scanning a student's dynamic QR code, the system validates signature authenticity, event ID match, and ticket confirmation.
* **FR-8.3:** If already scanned, the scanner immediately emits a high-visibility RED alert: *"Already Checked-In at 09:14 AM - Duplicate Rejected"*.
* **FR-8.4:** Valid scans write an attendance record with timestamp and increment the live venue counter.

### 3.9 Verified Feedback & "You Said, We Did" Kanban (FR-9)
* **FR-9.1:** Feedback submission shall be strictly disabled until the student has a verified attendance record AND the event status is `COMPLETED`.
* **FR-9.2:** Verified feedback collects ratings across 5 vectors: Content Depth, Organization, Speaker Quality, Venue Facilities, and Value for Time.
* **FR-9.3:** Attendees can post public suggestions which fellow verified attendees can upvote.
* **FR-9.4:** Club Admins can transition suggestions through a public Kanban board (`SUBMITTED` $\rightarrow$ `UNDER_REVIEW` $\rightarrow$ `PLANNED` $\rightarrow$ `IMPLEMENTED`) and attach proof photos/updates.

### 3.10 Verifiable E-Certificates & Public Portal (FR-10)
* **FR-10.1:** Post-event completion, the system generates high-resolution PDF certificates for all verified attendees.
* **FR-10.2:** Each certificate features a unique alphanumeric serial number (e.g. `CS-ARYA-2026-HACK-0142`) and a cryptographic SHA-256 seal.
* **FR-10.3:** The public endpoint `/verify/:certId` shall allow anyone (e.g., employers, recruiters) to verify certificate validity without logging in.
* **FR-10.4:** The student UI shall provide a 1-click "Add to LinkedIn" button pre-configured with certification metadata.

### 3.11 AICTE / RTU Activity Points & Transcript (FR-11)
* **FR-11.1:** Verified attendance automatically credits approved AICTE activity points to the student's profile.
* **FR-11.2:** Points are categorized into Technical, Cultural, Sports, and Social Welfare domains.
* **FR-11.3:** The system generates an official, downloadable **Activity Points Transcript PDF** with college seal and Dean authorization QR.

### 3.12 AI Copilot Suite (FR-12)
* **FR-12.1:** **Personalized Recommender:** Suggests events based on student department, semester, and past attendance tags.
* **FR-12.2:** **Club Event Copilot:** Generates comprehensive event schedules, rules, and promotional drafts from a brief prompt.
* **FR-12.3:** **NLP Sentiment & Clustering:** Groups attendee suggestions into actionable topic clusters and evaluates sentiment scores.
* **FR-12.4:** **Campus Concierge Chatbot:** Conversational RAG assistant answering queries regarding upcoming events, venues, and club guidelines.

### 3.13 3D Interactive Campus Digital Twin (FR-13)
* **FR-13.1:** Renders a lightweight, low-poly 3D model of Arya College campus landmarks using Three.js / React Three Fiber.
* **FR-13.2:** Active event venues display pulsing neon beacons indicating live happening spots.
* **FR-13.3:** Clicking a building triggers camera focus and opens an event drawer showing venue details and registrations.

---

## 4. Non-Functional Requirements (NFR)

### 4.1 Performance Requirements
* **NFR-1.1:** Event discovery and filtering queries must return in under 200ms for up to 10,000 active events.
* **NFR-1.2:** The gate scanner must complete dynamic QR validation in under 400ms on a standard 4G mobile connection.
* **NFR-1.3:** The 3D campus scene must maintain > 50 FPS on mobile and desktop GPUs, with asset bundle size < 2MB.

### 4.2 Security Requirements
* **NFR-2.1:** All communication must be encrypted over TLS 1.3 (HTTPS/WSS).
* **NFR-2.2:** Role and permission validation must be enforced on every backend service method, never relying solely on frontend UI hiding.
* **NFR-2.3:** Financial webhook callbacks from Razorpay must strictly validate header signatures against the configured secret key.
* **NFR-2.4:** Rate limiting of 100 requests/minute per IP address for standard endpoints, and 5 requests/minute for authentication endpoints.

### 4.3 Data Integrity & Concurrency
* **NFR-3.1:** Ticket seat reservation must use atomic MongoDB `$inc` operations with conditional capacity checks to eliminate race conditions and overbooking.
* **NFR-3.2:** Database indexes must be strictly created on email, roll number, event slug, ticket number, and compound keys for attendance and registrations.

---
*End of SRS. Document cross-referenced in ERD, TRD, and API Specification.*
