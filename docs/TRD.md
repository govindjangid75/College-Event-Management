# CampusSphere: Technical Requirements Document (TRD)
**System Architecture & Technical Engineering Specification**  
**Project:** CampusSphere ? Arya College Platform  
**Version:** 1.0.0-PROD  
**Status:** Approved  

---

## 1. Architectural Style & Design Principles

CampusSphere is designed with a **Domain-Driven Modular Architecture** (Modular Monolith ready for microservices extraction). This ensures extreme development agility, single-command deployment, zero distributed transaction overhead, and strict internal boundary encapsulation.

### Core Architectural Tenets:
1. **Stateless Security Perimeter:** No session state is held on server instances; authorization is driven by cryptographically signed JWT tokens and HttpOnly refresh cookies.
2. **ACID Transactions on Critical Boundaries:** Payments, ticket reservations, and attendance recording utilize MongoDB multi-document transactions to guarantee atomicity.
3. **Idempotency by Design:** Financial webhooks and ticket issuance endpoints support idempotent processing to prevent duplicate ledger credits.
4. **Offline Resilience:** Gate attendance scanners feature local cryptographic validation capable of validating dynamic passes even with unstable venue internet connectivity.
5. **Separation of Concerns:** Client business logic is decoupled through custom hooks and services; backend domains communicate via explicit service contracts.

---

## 2. Technology Stack & Production Tooling

```
+---------------------------------------------------------------------------------------------------------+
|                                           TECH STACK MATRIX                                             |
+---------------------+-------------------------------+---------------------------------------------------+
| LAYER               | TECHNOLOGY                    | RATIONALE / SELECTION JUSTIFICATION               |
+---------------------+-------------------------------+---------------------------------------------------+
| Frontend UI         | React 19 + TypeScript + Vite  | Sub-second HMR, complete type-safety, lightweight  |
|                     | Tailwind CSS                  | Responsive utility styling, dark/light aesthetics |
| 3D Visualization    | Three.js + React Three Fiber  | WebGL accelerated low-poly campus twin rendering  |
| State & Cache       | TanStack Query v5 + Context   | Client-side API caching, automatic revalidation   |
| Backend Engine      | Spring Boot 3.3 (Java 21) OR  | High-throughput reactive REST API, robust security|
|                     | Node.js 24 + Express / NestJS | ecosystem, enterprise-grade validation & DI       |
| Security & Auth     | Spring Security / JWT (RFC)   | Role & authority checks, BCrypt cost 12 hashing   |
| Database            | MongoDB 7.0+ (Replica Set)    | High-velocity document writes, geo-indexing, JSON |
| Payments            | Razorpay Payments SDK         | Standard Indian UPI/Card gateway, webhook events  |
| Real-time Alerts    | Spring WebSocket (STOMP / WSS)| Low-latency venue alerts and capacity updates     |
| AI Copilot Subsystem| LLM API + Vector Embeddings   | Recommendation affinity, event copywriting, NLP   |
| Vector PDF Engine   | PDFKit / iText 8              | Vector PDF certificates and AICTE transcripts     |
+---------------------+-------------------------------+---------------------------------------------------+
```

---

## 3. High-Level Technical Topology

```
[ Browser / Mobile PWA Client ]
               |
               | (HTTPS / WSS)
               v
+---------------------------------------------------------------------------+
|                          NGINX / REVERSE PROXY                            |
|  - TLS Termination (Let's Encrypt / Wildcard SSL)                         |
|  - Gzip / Brotli Static Asset Compression                                 |
|  - Rate Limiting (Token Bucket: 100 req/min general, 5 req/min auth)      |
+---------------------------------------------------------------------------+
               |
               v
+---------------------------------------------------------------------------+
|                        API GATEWAY & SECURITY LAYER                       |
|  - JwtAuthenticationFilter (Extract Bearer Token, Verify HMAC-SHA256)     |
|  - CorsFilter (Allow configured Arya College domains)                     |
|  - MethodSecurityInterceptor (@PreAuthorize("hasRole('ADMIN')"))          |
+---------------------------------------------------------------------------+
               |
               +------------------------------------------------------------+
               |                                                            |
               v                                                            v
+---------------------------------------------+              +------------------------------+
|             REST CONTROLLERS                |              |     WEBSOCKET DISPATCHER     |
|  - AuthController, EventController          |              |  - Live Venue Check-in Push  |
|  - PaymentController, AttendanceController  |              |  - Emergency Broadcast Alerts|
+---------------------------------------------+              +------------------------------+
               |                                                            |
               v                                                            v
+-------------------------------------------------------------------------------------------+
|                                    SERVICE BUSINESS LAYER                                 |
|  +--------------------+  +--------------------+  +--------------------+  +--------------+ |
|  | EventEngineService |  | VenueBufferService |  | DynamicQrService   |  | LedgerService| |
|  +--------------------+  +--------------------+  +--------------------+  +--------------+ |
|  +--------------------+  +--------------------+  +--------------------+  +--------------+ |
|  | GateScannerService |  | FeedbackGateService|  | AictePointsService |  | AiCopilotSvc | |
|  +--------------------+  +--------------------+  +--------------------+  +--------------+ |
+-------------------------------------------------------------------------------------------+
               |                                           |                        |
               v                                           v                        v
+-----------------------------+             +----------------------+   +--------------------+
|    MONGODB DATA ACCESS      |             |   EXTERNAL GATEWAYS  |   | AI INFERENCE ENGINE|
|  - Spring Data Mongo Repos  |             |  - Razorpay REST API |   |  - Embedding Engine|
|  - MongoTemplate (Tx, $inc) |             |  - S3 Storage Buckets|   |  - NLP Clustering  |
+-----------------------------+             +----------------------+   +--------------------+
```

---

## 4. Critical Algorithmic Implementations

### 4.1 Anti-Screenshot Dynamic Rolling QR Engine (TOTP/HMAC)
To prevent screenshot forwarding and ticket forgery:
1. Every confirmed registration stores a unique 256-bit `hmac_seed`.
2. Every 30 seconds, the client application derives the dynamic token:
   $$T = \lfloor \text{Current Unix Timestamp} / 30 \rfloor$$
   $$\text{Dynamic Token} = \text{HMAC-SHA256}(T \parallel \text{ticket\_number} \parallel \text{user\_id}, \text{hmac\_seed})$$
3. The QR payload encodes:
   ```json
   {
     "tkt": "CS-TKT-2026-8942",
     "uid": "65b9e1a...",
     "eid": "65b9e2f...",
     "t": 177482910,
     "sig": "a9f3b7..."
   }
   ```
4. **Scanner Validation Pipeline:**
   - The scanner evaluates the token against time window $T$, $T-1$, and $T+1$ (allowing $\pm 30$ seconds clock drift).
   - If timestamp delta $> 45$ seconds or HMAC mismatch, scan is rejected immediately.
   - If valid, checks `attendance_records` for existing `ticket_number` or `user_id + event_id`. If found, triggers immediate duplicate rejection.

### 4.2 Venue Clash & Buffer Collision Detection Algorithm
Campus venues require buffer periods for sound setup, lighting, and stage cleanup.
* Given proposed booking: $E_{new} = (V, \text{start}, \text{end})$
* System extends booking window with 30-minute buffers:
  $$W_{active} = [\text{start} - 30\text{min},\ \text{end} + 30\text{min}]$$
* Collision query executed on MongoDB:
  ```json
  {
    "venue_id": proposed_venue_id,
    "status": { "$in": ["APPROVED", "LIVE"] },
    "$or": [
      {
        "event_schedule.start_time": { "$lt": W_active.end },
        "event_schedule.end_time": { "$gt": W_active.start }
      }
    ]
  }
  ```
* If count $> 0$, system rejects booking and returns exact conflicting event details and open available alternatives.

### 4.3 Atomic Capacity Lock & Anti-Overbooking Mechanism
To ensure zero overbooking during flash registrations for high-demand events:
```javascript
// Executes as a single atomic operation in MongoDB
const result = await db.events.updateOne(
  {
    _id: eventId,
    status: "APPROVED",
    "ticketing.registered_count": { $lt: max_capacity }
  },
  {
    $inc: { "ticketing.registered_count": 1 }
  }
);

if (result.matchedCount === 0) {
  throw new CapacityExceededException("Event is sold out. Added to waitlist.");
}
```

### 4.4 Razorpay Webhook Idempotency & Club Ledger Settlement
To guarantee funds are correctly attributed and webhooks are processed only once:
1. Razorpay dispatches `payment.captured` event to `/api/v1/payments/webhook`.
2. Header `X-Razorpay-Signature` verified against `RAZORPAY_WEBHOOK_SECRET`.
3. Checks if `payments` collection already contains `razorpay_payment_id`.
   - If present, returns `HTTP 200 OK` (idempotent no-op).
4. In a single ACID transaction:
   - Sets registration status to `CONFIRMED`.
   - Generates ticket number and HMAC seed.
   - Creates `payments` record linking `club_id`.
   - Appends entry to `club_ledgers` crediting `net_amount` to organizer club.
   - Updates `clubs.treasury.available_balance`.
   - Dispatches confirmation email and WebSocket ticket event.

### 4.5 5-Dimensional Verified Feedback Gatekeeping
```text
Student requests POST /api/v1/feedback/submit:
  1. Retrieve registration:
     SELECT * FROM registrations WHERE event_id = :eId AND user_id = :uId;
     -> If null: REJECT (403 Forbidden: "User never registered")
  2. Check event status:
     SELECT status FROM events WHERE _id = :eId;
     -> If status != 'COMPLETED': REJECT (400 Bad Request: "Event not concluded")
  3. Check attendance check-in:
     SELECT * FROM attendance_records WHERE event_id = :eId AND user_id = :uId;
     -> If null: REJECT (403 Forbidden: "Only verified attendees can submit feedback")
  4. Check duplicate feedback:
     SELECT * FROM event_feedback WHERE event_id = :eId AND user_id = :uId;
     -> If present: REJECT (409 Conflict: "Feedback already recorded")
  5. Save 5-factor ratings, execute NLP sentiment analysis, and record review.
```

### 4.6 AICTE / RTU Activity Points Calculation
* When event status transitions to `COMPLETED`:
  1. System queries all attendees in `attendance_records` for that `event_id`.
  2. For each attendee, atomically increments student's `student_profile.activity_points_total` by `events.activity_points_awarded`.
  3. Records entry in `activity_point_ledger` with category breakdown:
     - `TECHNICAL_INNOVATION` (Hackathons, Coding, Robotics)
     - `CULTURAL_ARTS` (Dance, Music, Drama)
     - `COMMUNITY_CSR` (Social Activities, Blood Donation)
     - `SPORTS_ATHLETICS` (Chess, Esports, Sports)
  4. Generates verifiable e-certificate with embedded point allotment seal.

---

## 5. Security & Threat Modeling (STRIDE)

| Threat Type | Potential Vulnerability | Mitigation Implemented |
|---|---|---|
| **Spoofing** | Student impersonates Club Admin or HOD | Stateless JWT signed with 512-bit HMAC secret; role claims strictly checked on every controller endpoint. |
| **Tampering** | Student alters ticket status from `WAITLIST` to `CONFIRMED` | Database fields write-protected; status transitions only executed via backend services. |
| **Repudiation** | Club Admin denies deleting or modifying an event | Immutable `audit_logs` record `user_id`, `ip_address`, `timestamp`, `action`, and `diff`. |
| **Information Disclosure** | Student views financial records of clubs | `@PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")` prevents unauthorized read access. |
| **Denial of Service** | Flash botting registration endpoints | IP-based rate limiting via Redis token bucket; Cloudflare DDoS protection; atomic DB locks. |
| **Elevation of Privilege** | Student grants self `SUPER_ADMIN` role | Role field explicitly stripped from public user registration and profile update DTOs. |

---

## 6. Observability, Logging & Telemetry

* **Structured Logging:** Slf4j / Logback writing JSON logs with `trace_id`, `user_id`, `event_id`, and `duration_ms`.
* **Health Endpoints:** Spring Boot Actuator `/actuator/health` monitoring MongoDB connectivity, disk space, and memory pool.
* **Audit Trail Collection:** All sensitive operations (event approvals, refunds, manual check-in overrides) write to `audit_logs` with a 365-day TTL retention.

---
*End of TRD. Architectural contracts verified for production resilience.*
