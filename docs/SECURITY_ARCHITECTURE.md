# CampusSphere: Security Architecture & Fraud Prevention Specification
**Classification:** Enterprise Security & Compliance  
**Project:** CampusSphere ? Arya College Platform  
**Version:** 1.0.0-PROD  
**Status:** Approved  

---

## 1. Security Philosophy & Zero-Trust Perimeter

CampusSphere enforces a strict **Zero-Trust Architecture**:
1. Never trust the frontend client for status, pricing, or authorization.
2. Every state mutation is authenticated, authorized, and logged with a non-repudiable audit trail.
3. Cryptographic defenses are implemented against physical and digital fraud (ticket screenshot forwarding, proxy check-in, fake certificates, fake reviews, and payment tampering).

---

## 2. Authentication & JWT Lifecycle Management

```
[ Client ]                        [ API Gateway ]                        [ Auth Service ]
    |                                   |                                       |
    | 1. POST /auth/login               |                                       |
    |---------------------------------->|-------------------------------------->|
    |                                   |                                       | 2. BCrypt.verify()
    |                                   |                                       | 3. Issue Token Pair:
    |                                   |                                       |    - Access (15m, payload)
    |                                   |                                       |    - Refresh (7d, DB UUID)
    | 4. Return Access Token &          |                                       |
    |    Set-Cookie: refreshToken (HttpOnly, Secure, SameSite=Strict)           |
    |<----------------------------------|<--------------------------------------|
```

### 2.1 Token Specifications
* **Access Token:**
  - Algorithm: `HS512` (HMAC with SHA-512) or `RS256` (Asymmetric RSA keypair).
  - Expiry: 15 minutes (`900` seconds).
  - Claims: `sub` (User ID), `role` (`STUDENT` / `CLUB_ADMIN` / `SUPER_ADMIN`), `roll` (Roll No), `clubs` (Array of administered club IDs), `exp`, `iat`.
* **Refresh Token:**
  - Stored in a cryptographically random, hashed form in MongoDB `refresh_tokens`.
  - Delivered strictly via `HttpOnly`, `Secure`, `SameSite=Strict` cookie to prevent Cross-Site Scripting (XSS) extraction.
  - Revoked immediately upon password change or explicit logout.

---

## 3. Anti-Screenshot Dynamic Rolling QR Architecture

### 3.1 Problem Analysis
In typical college events, a student registers, takes a screenshot of their QR pass, and forwards it to friends via WhatsApp or Telegram, enabling proxy entry.

### 3.2 Solution: Rotating HMAC Cryptographic Pass
```
                                Dynamic Token Computation
                                
   +------------------------------------------------------------------------+
   |  Inputs:                                                               |
   |  - Ticket Number (e.g., "CS-TKT-2026-8942")                            |
   |  - User ID ("65b9e1a89c...")                                           |
   |  - Time Window: T = floor(Current Unix Epoch Seconds / 30)             |
   |  - Registration Secret Seed: HMAC_SEED (256-bit random)                |
   +------------------------------------------------------------------------+
                                      |
                                      v
   +------------------------------------------------------------------------+
   |  Hash Generation:                                                      |
   |  Raw Data = T + ":" + Ticket_Number + ":" + User_ID                    |
   |  Signature = HMAC_SHA256(Raw Data, HMAC_SEED)                          |
   |  Token Payload = Base64URL( { Ticket, User, T, Signature } )           |
   +------------------------------------------------------------------------+
                                      |
                                      v
   +------------------------------------------------------------------------+
   |  Client Rendering:                                                     |
   |  - QR Code regenerates every 30 seconds                                |
   |  - Animated circular progress ring visually ticks down 30s -> 0s       |
   |  - Holographic shimmering SVG watermark overlays pass                  |
   +------------------------------------------------------------------------+
```

### 3.3 Gate Scanner Verification Protocol
1. Scanner decodes Base64 payload.
2. Evaluates time window: checks $T$, $T-1$, and $T+1$ to allow $\pm 30$ seconds clock skew between mobile phones.
3. If $T_{client} < T - 1$, scan is immediately marked **EXPIRED (Screenshot Replay Detected)**.
4. Checks single-use constraint:
   - Queries `attendance_records` on `{ event_id, user_id }`.
   - If present, emits audible alarm and high-visibility red banner with check-in timestamp.
5. If absent, writes attendance record atomically.

---

## 4. Payment Security & Tamper-Proof Split Accounting

```
+---------------------------------------------------------------------------+
|                          PAYMENT SECURITY MODEL                           |
+---------------------------------------------------------------------------+
|                                                                           |
| 1. Order Creation:                                                        |
|    - Server creates Razorpay Order with fixed server-calculated amount.   |
|    - Client CANNOT specify ticket price.                                  |
|                                                                           |
| 2. Signature Validation:                                                  |
|    - Client returns: { razorpay_order_id, razorpay_payment_id, signature }|
|    - Server calculates:                                                   |
|      Expected_Sig = HMAC_SHA256(order_id + "|" + payment_id, SECRET)      |
|    - If Expected_Sig !== Received_Sig -> REJECT & LOG FRAUD ATTEMPT.      |
|                                                                           |
| 3. Double-Credit Prevention:                                              |
|    - Unique index on `payments.razorpay.payment_id`.                      |
|    - Duplicate webhook or client replay attempts return idempotent 200 OK.|
|                                                                           |
| 4. Immutable Club Ledger:                                                 |
|    - Club Admins have READ-ONLY permission on their club treasury.        |
|    - No API endpoint exists to update `available_balance` directly.       |
|    - Balance updates occur strictly through backend transaction events.   |
+---------------------------------------------------------------------------+
```

---

## 5. Attendance-Gated Feedback Security (Anti-Fake Reviews)

To protect event organizers from smear reviews or competitor spam:
* **Rule 1:** User must have a confirmed registration record.
* **Rule 2:** Event status must be `COMPLETED`.
* **Rule 3:** User must possess a verified `attendance_records` document created by an authorized Club Admin at the venue gate.
* **Rule 4:** One review per student per event enforced by a unique composite database index: `{ event_id: 1, user_id: 1 }`.
* Any attempt to bypass via API inspection returns `403 Forbidden` with audit notification.

---

## 6. Verifiable Certificate Cryptography

Each digital certificate generated by CampusSphere incorporates a public SHA-256 seal:
$$\text{Seal} = \text{SHA256}(\text{Certificate\_ID} + \text{Roll\_No} + \text{Event\_ID} + \text{Issue\_Date} + \text{COLLEGE\_PRIVATE\_SALT})$$
* This seal is stored in MongoDB and printed as a QR code and human-readable alphanumeric code on the PDF certificate.
* When a prospective employer or recruiter scans the QR code or navigates to `/verify/:certId`, the backend re-computes the hash and validates:
  1. Student Name and University Roll Number.
  2. Event Title and Organizing Club.
  3. AICTE Activity Points allocated.
  4. Issuance Date and Dean's Digital Verification Seal.
* Any altered PDF (name/roll changed in graphics software) fails cryptographic hash lookup immediately.

---

## 7. Role-Based Access Control (RBAC) Hierarchy

```
                                  [ SUPER_ADMIN ]
                           (Dean, HOD, Principal, Provost)
                                         |
                       +-----------------+-----------------+
                       |                                   |
                       v                                   v
               [ CLUB_ADMIN ]                         [ STUDENT ]
        (Club President, Secretary,               (Enrolled Student,
          Faculty Coordinator)                      Attendee, Team Member)
```

### Authority Matrix:
* `hasAuthority('SUPER_ADMIN')`: Full campus oversight, event approval/rejection, global financial audit, venue conflict overrides, AICTE transcript sign-off.
* `hasAuthority('CLUB_ADMIN')`: Create/edit own club events, book venues, launch gate QR scanner, view own club treasury, manage "You Said, We Did" suggestions.
* `hasAuthority('STUDENT')`: Register (solo/team), pay, view personal rolling QR tickets, check attendance, claim certificates, submit verified feedback.

---
*End of Security Architecture Specification.*
