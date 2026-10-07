# CampusSphere — Complete Team Workflow & Submission Guide
**Project Based Learning (PBL) — Java Projects • 5th Semester • CSE / AI&DS / IT**  
**Academic Year:** 2026-27 | **Session:** Session 2026-27  
**Institution:** Arya College of Engineering & I.T. (ACEIT), Jaipur  
**Mentor / Project Guide:** Er. Ram Babu Buri, Dept. of Computer Science & Engineering  
**Project Title:** *CampusSphere: A Unified Platform for College Events, Club Treasuries, Verified Attendance and AICTE Activity Points*

---

## 🌟 Executive Summary: Pure Project Ka Plan Kaise Chalege

Puri team ko 5 hisson (5 branches) me divide kiya gaya hai, jo 5 July 2026 se 11 October 2026 tak ke 14 weeks / 10 PBL Milestones ko cover karta hai:

```
                                 [main / master]
                                (Integrated App)
                                       │
    ┌──────────────┬───────────────────┼───────────────────┬──────────────────┐
    ▼              ▼                   ▼                   ▼                  ▼
[govind-jangid] [ankit-yadav]   [garvita-jain]       [ayushi-garg]    [anshika-pathak]
 Student UI &   Admin Consoles,  Backend Auth,       Ticketing,       Database, Scan,
 Rolling QR,    Scanner PWA,     RBAC & Venue        Razorpay &       Attendance Gate,
 3D Twin & AI   Docker & CI/CD   Buffer Engine       Club Ledgers     AICTE Points
```

---

## 👥 Kaunsa Member Kya Kaam Dikhayega (Viva & Portal Defense)

### 1. Govind Jangid (Team Leader) — `govind-jangid`
- **Role:** Frontend Developer (Student Experience) & Integration Lead
- **Key Modules:**
  - Student Interface: Home, Clubs Showcase, Events Feed, My Passes.
  - Anti-Screenshot 30-Second Rolling QR Pass with circular animated SVG countdown ring.
  - Razorpay Client Checkout Modal with UPI QR & confetti celebration.
  - Student AICTE 100-Point Progress Meter & Certificate Wallet with LinkedIn integration.
  - Interactive Three.js 3D Campus Digital Twin (`/campus-3d`) with pulsing event beacons.
  - Floating Campus Concierge AI Chatbot interface.

### 2. Ankit Yadav — `ankit-yadav`
- **Role:** Frontend Developer (Admin Consoles) & DevOps / Deployment Lead
- **Key Modules:**
  - Club Admin Management Console (`/club-admin`) with executive leads & read-only treasury.
  - 5-Step Event Creation Wizard (`CreateEventModal.tsx`) with conflict alerts.
  - Super Admin (Dean Directorate) Approval Queue (`/admin`) and financial audit views.
  - Camera-based Gate Scanner PWA with high-visibility green/red banners & Web Audio alarms.
  - "You Said, We Did" Suggestion Kanban Board with drag-and-drop status stages.
  - Multi-stage Dockerfiles, Docker Compose production stack, NGINX TLS 1.3 reverse proxy, and GitHub Actions CI/CD pipeline.

### 3. Garvita Jain — `garvita-jain`
- **Role:** Backend Developer (Authentication, RBAC & Core Event Engine)
- **Key Modules:**
  - Spring Boot 3.3.4 & Java 21 foundation with Spring Security.
  - BCrypt password hashing (cost 12), HS512 JWT access tokens (15m), and HttpOnly refresh token rotation (7d).
  - Role-Based Access Control (`STUDENT`, `CLUB_ADMIN`, `SUPER_ADMIN`).
  - Institutional 30-Minute Venue Buffer Conflict Engine (`VenueClashEngineService.java`) preventing back-to-back hall overlaps.
  - Event Lifecycle state machine (DRAFT -> PENDING_APPROVAL -> APPROVED -> LIVE -> COMPLETED).
  - Immutable Audit Logging and STRIDE threat analysis.

### 4. Ayushi Garg — `ayushi-garg`
- **Role:** Backend Developer (Registration, Payments, Ledgers & PDF Engine)
- **Key Modules:**
  - Atomic Capacity Lock using MongoDB `$inc` operator preventing overbooking under concurrency.
  - Solo & Team Registration with unique squad passcodes (e.g. `ACE-8492`).
  - Razorpay Payment Gateway integration: server order creation, HMAC-SHA256 signature verification.
  - Idempotent asynchronous webhooks preventing duplicate ticket issuance.
  - Isolated Double-Entry Club Sub-Ledgers with automatic 2% platform fee calculation.
  - Server-side cryptographic Certificate & Transcript PDF generation using iText 8.

### 5. Anshika Pathak — `anshika-pathak`
- **Role:** Database Architect & Backend Developer (Data Architecture, Attendance & Verification)
- **Key Modules:**
  - MongoDB Atlas replica set schema design with 11 collections and compound unique indices.
  - Database Seeder Service populating 15 Arya clubs, 6 venues, and official events (SIH 2026, THAR, etc.).
  - Gate Scan Verification API (`POST /api/attendance/verify-scan`) with Single-Scan Guarantee.
  - Attendance-Gated Verified Feedback system (enforcing 4 strict preconditions).
  - AICTE 100-Activity-Points Ledger Engine automatically crediting credits upon event completion.
  - Public Certificate Verification API (`/verify/:id`) using SHA-256 digital seals.
  - Automated MongoDB BSON logical backups (`mongodump` & `mongorestore` drills).

---

## 📝 Step-by-Step: Daily Work Log Portal Kaise Bharein (Screenshot 1)

Har student ko portal me login karke **"Daily Work Log"** tab par jana hai:
1. Open [`docs/pbl-reports/DAILY_WORK_LOGS_ALL_MEMBERS.md`](file:///c:/Users/govin/OneDrive/Desktop/event/docs/pbl-reports/DAILY_WORK_LOGS_ALL_MEMBERS.md).
2. Apna section dhoondo (Govind, Ankit, Garvita, Ayushi, ya Anshika).
3. **Date:** Us din ki date select karo (e.g. `07-10-2026`).
4. **Hours Worked:** Table se hours daalo (e.g. `2.5`).
5. **Status:** `Completed` select karo.
6. **Work Description:** Diya gaya exact text copy-paste karo.
7. Click **+ Submit Today's Work**.

---

## 📊 Step-by-Step: Weekly Project Report Kaise Bharein (Screenshot 2)

Team Leader **Govind Jangid** (ya assigned member) har week ki overall progress submit karega:
1. Open [`docs/pbl-reports/WEEKLY_PROJECT_REPORTS.md`](file:///c:/Users/govin/OneDrive/Desktop/event/docs/pbl-reports/WEEKLY_PROJECT_REPORTS.md).
2. College portal ke **"Weekly Report"** tab par jao.
3. **Week:** Select `Week 1`, `Week 2` ... up to `Week 10` (Mode A) ya `Week 14` (Mode B).
4. **GitHub / Report Link:** Apna repository link paste karo:
   `https://github.com/govind-aryacollege/CampusSphere-ACEIT/tree/main`
5. **Work Completed This Week:** Consolidated text copy karo.
6. **Problems Faced:** Realistic engineering hurdles copy karo.
7. **Plan for Next Week:** Next sprint tasks copy karo.
8. Click **Submit Weekly Report**.

---

## 🚀 GitHub Repository Setup & Push Commands (Ready to Run)

Jab GitHub par repository banani ho:
```bash
# 1. GitHub par jaakar naya repository create karo:
# Repository name: CampusSphere-ACEIT
# Visibility: Public (ya Private)

# 2. Local repository me remote link add karo:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/CampusSphere-ACEIT.git

# 3. Main branch aur 5 feature branches ko push karo:
git push -u origin main
git push -u origin govind-jangid
git push -u origin ankit-yadav
git push -u origin garvita-jain
git push -u origin ayushi-garg
git push -u origin anshika-pathak

# Ya fir single command me sabhi branches push karo:
git push -u origin --all
```

---

## 🎯 Viva Examination Quick Reference (Er. Ram Babu Buri & External Examiners)

| Question | Examiner Expected Answer |
|---|---|
| **Project Name & Concept?** | *CampusSphere*: Unified campus lifecycle platform covering 15 student clubs, clash-free venue scheduling with 30-min setup/teardown buffers, rolling QR passes, Razorpay split ledgers, verified attendance, and AICTE 100-activity-points tracking for RTU B.Tech Honors degree. |
| **How does anti-screenshot pass work?** | Uses HMAC-SHA256 time-slice derivation (`T = floor(currentTime / 30)`). Token rotates every 30 seconds with animated SVG countdown and holographic watermark. Gate scanner tolerates `T-1, T, T+1` window drift. |
| **How is overbooking prevented?** | Atomic capacity lock via MongoDB single-document `$inc` operator with `{ registeredCount: { $lt: maxCapacity } }`. Single-document update is atomic, mathematically eliminating concurrency race conditions. |
| **How is fake review/certificate prevented?** | Attendance-gating: only students scanned at venue gate receive attendance records. Feedback and automated AICTE point credit are strictly unlocked by that gate-verified fact. Certificates carry SHA-256 seal verified online. |
| **Deployment stack?** | Multi-stage Docker containers, NGINX TLS 1.3 reverse proxy with token-bucket rate limiting (100 req/min), Spring Boot 3.3 on Java 21, React 19 + TypeScript, and MongoDB 7 replica set on AWS Mumbai. |
