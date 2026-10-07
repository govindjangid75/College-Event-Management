# CampusSphere — 12-Week Project Report Submissions
**Project Based Learning (PBL) — Java Projects • 5th Semester • CSE / AI&DS / IT**  
**Academic Year:** 2026-27 | **Session:** Session 2026-27  
**Institution:** Arya College of Engineering & I.T. (ACEIT), Jaipur  
**Mentor / Project Guide:** Er. Ram Babu Buri, Dept. of Computer Science & Engineering  
**Team Leader:** Govind Jangid (`govindjangid75`, `govindjangidt@gmail.com`)  
**Repository Link:** `https://github.com/govindjangid75/College-Event-Management/tree/govind`  
**Schedule:** Strictly 12 Weeks (Starting 06 July 2026 Monday to 07 October 2026)  

---

### 🔹 Week 1: Team Formation, Guide Selection & Abstract
- **Week:** `Week 1`
- **Date Range:** `06 Jul 2026 – 12 Jul 2026`
- **GitHub / Report Link:** `https://github.com/govindjangid75/College-Event-Management/tree/govind`
- **Work Completed This Week:**
  > Formed project team of 5 under Er. Ram Babu Buri. Finalized CampusSphere problem statement for college events and AICTE activity points. Prepared project abstract. Initialized git repository, setup React 19 + TypeScript frontend with Vite, Tailwind emerald tokens, and Spring Boot 3.3.4 project on Java 21 with MongoDB Atlas connection.
- **Problems Faced:**
  > Defining clean boundaries between club ticketing, treasury, and RTU AICTE activity points.
- **Plan for Next Week:**
  > Write Software Requirements Specification (SRS) in IEEE 830 format and build JWT auth.

### 🔹 Week 2: Software Requirements Specification (SRS) & Auth Foundation
- **Week:** `Week 2`
- **Date Range:** `13 Jul 2026 – 19 Jul 2026`
- **GitHub / Report Link:** `https://github.com/govindjangid75/College-Event-Management/tree/govind`
- **Work Completed This Week:**
  > Authored IEEE 830 SRS document. Implemented Spring Security with BCrypt password hashing, HS512 JWT access tokens (15m), and 7-day HttpOnly refresh tokens. Designed MongoDB user and venue document schemas. Built student registration and multi-identifier login screens (Email, RTU Roll No, Enrollment No) with route guards.
- **Problems Faced:**
  > Cross-origin cookie handling between Vite port 5173 and Spring Boot port 8080.
- **Plan for Next Week:**
  > Create UML diagrams, seed 15 master clubs and venues, and build clubs showcase page.

### 🔹 Week 3: UML Design & 15 Master Clubs Directory
- **Week:** `Week 3`
- **Date Range:** `20 Jul 2026 – 26 Jul 2026`
- **GitHub / Report Link:** `https://github.com/govindjangid75/College-Event-Management/tree/govind`
- **Work Completed This Week:**
  > Created UML Class and Sequence diagrams. Seeded 15 official Arya College clubs with faculty coordinators and dedicated UPI treasury sub-ledgers. Built 15 Clubs showcase page (`/clubs`) and individual club profile pages with TanStack Query caching. Exposed Club REST APIs with category filtering.
- **Problems Faced:**
  > Enforcing read-only ledger balances for club admins to maintain financial integrity.
- **Plan for Next Week:**
  > Implement 30-minute venue buffer conflict engine and event explorer feed.

### 🔹 Week 4: DB Indexing & 30-Minute Venue Buffer Conflict Engine
- **Week:** `Week 4`
- **Date Range:** `27 Jul 2026 – 02 Aug 2026`
- **GitHub / Report Link:** `https://github.com/govindjangid75/College-Event-Management/tree/govind`
- **Work Completed This Week:**
  > Completed database indexing on MongoDB Atlas. Implemented Institutional 30-minute Venue Buffer Conflict Engine (`VenueClashEngineService.java`) extending event windows by 30-min setup and teardown buffers. Developed Campus Events explorer (`/events`) with search, category filters, and live capacity counters.
- **Problems Faced:**
  > Handling overlapping time window math with buffers in MongoDB queries.
- **Plan for Next Week:**
  > Implement atomic capacity lock and solo/team hackathon registration.

### 🔹 Week 5: Solo/Team Registration & Atomic Capacity Lock
- **Week:** `Week 5`
- **Date Range:** `03 Aug 2026 – 09 Aug 2026`
- **GitHub / Report Link:** `https://github.com/govindjangid75/College-Event-Management/tree/govind`
- **Work Completed This Week:**
  > Implemented Atomic Capacity Lock in Spring Boot using MongoDB `$inc` operator to mathematically eliminate overbooking. Built Solo Registration and Hackathon Team Registration with 4-character invite passcodes (e.g. ACE-8492). Built registration dialog, squad roster view, waitlist banner, and Dean approval queue.
- **Problems Faced:**
  > Atomic rollback when teammate join fails after capacity increment.
- **Plan for Next Week:**
  > Implement dynamic 30-second rolling QR pass and gate scanner PWA.

### 🔹 Week 6: 30-Sec Rolling Dynamic QR Pass & Gate Scanner PWA
- **Week:** `Week 6`
- **Date Range:** `10 Aug 2026 – 16 Aug 2026`
- **GitHub / Report Link:** `https://github.com/govindjangid75/College-Event-Management/tree/govind`
- **Work Completed This Week:**
  > Developed Dynamic QR Token service using HMAC-SHA256 time-slice derivation (T = floor(t / 30)). Built student My Passes page with 30-second rotating QR pass, circular SVG countdown ring, clock-offset correction, and animated holographic watermark to defeat screenshots. Built camera-based Gate Scanner PWA with audio/vibration feedback.
- **Problems Faced:**
  > Clock difference between student phones and server (resolved by adding T-1, T, T+1 window tolerance).
- **Plan for Next Week:**
  > Integrate Razorpay payment gateway and split club ledgers.

### 🔹 Week 7: Razorpay Payment Gateway & Split Ledgers
- **Week:** `Week 7`
- **Date Range:** `17 Aug 2026 – 23 Aug 2026`
- **GitHub / Report Link:** `https://github.com/govindjangid75/College-Event-Management/tree/govind`
- **Work Completed This Week:**
  > Integrated Razorpay Java SDK with test keys, server order creation, and HMAC-SHA256 signature verification. Added idempotent webhook handler to prevent duplicate ticket issuance. Wrapped ticket booking and ledger credit inside MongoDB multi-document ACID transactions. Built client checkout modal supporting UPI QR and Cards.
- **Problems Faced:**
  > Webhook retries handling and ensuring club leads have strictly read-only access to treasury balances.
- **Plan for Next Week:**
  > Build attendance-gated feedback system and Kanban board.

### 🔹 Week 8: Gate Scanner Stress Testing & Offline PWA
- **Week:** `Week 8`
- **Date Range:** `24 Aug 2026 – 30 Aug 2026`
- **GitHub / Report Link:** `https://github.com/govindjangid75/College-Event-Management/tree/govind`
- **Work Completed This Week:**
  > Tested gate scanner under variable lighting conditions; achieved sub-400ms scan verification latency on 4G. Added vibration haptic feedback and duplicate-scan debounce guard. Built club payout settlement requests. Added LocalStorage caching for recent passes enabling offline presentation during weak venue network. Mid-term review with guide.
- **Problems Faced:**
  > Camera autofocus latency on low-end devices; added manual roll-number fallback modal.
- **Plan for Next Week:**
  > Implement attendance-gated feedback and suggestion Kanban board.

### 🔹 Week 9: Attendance-Gated Verified Feedback & Kanban Board
- **Week:** `Week 9`
- **Date Range:** `31 Aug 2026 – 06 Sep 2026`
- **GitHub / Report Link:** `https://github.com/govindjangid75/College-Event-Management/tree/govind`
- **Work Completed This Week:**
  > Implemented Attendance-Gated Feedback service enforcing 4 strict preconditions: confirmed ticket, COMPLETED event status, verified gate attendance, and 1 review per student. Built post-event 5-factor rating modal (Content, Venue, Speaker, Logistics) and Student Suggestion submission modal with upvoting. Built 'You Said, We Did' Kanban board.
- **Problems Faced:**
  > Blocking review spam submitted via API inspection by non-attendees.
- **Plan for Next Week:**
  > Implement verifiable certificates with SHA-256 seals, AICTE points engine, and PDF generation.

### 🔹 Week 10: Verifiable Certificates & AICTE 100-Point Engine
- **Week:** `Week 10`
- **Date Range:** `07 Sep 2026 – 13 Sep 2026`
- **GitHub / Report Link:** `https://github.com/govindjangid75/College-Event-Management/tree/govind`
- **Work Completed This Week:**
  > Implemented cryptographic SHA-256 digital seals for certificates. Integrated iText 8 vector PDF library to generate certificates with embedded verification QR codes. Built automated AICTE 100-Activity-Points ledger crediting job upon event completion. Built Public Certificate Verification page (`/verify/:certId`), LinkedIn share integration, and transcript view.
- **Problems Faced:**
  > Rendering high-resolution vector crests in PDF without excessive memory overhead.
- **Plan for Next Week:**
  > Build AI event recommender, concierge chatbot, and copilot drafter panel.

### 🔹 Week 11: AI Copilot Suite & Campus Concierge Chatbot
- **Week:** `Week 11`
- **Date Range:** `14 Sep 2026 – 20 Sep 2026`
- **GitHub / Report Link:** `https://github.com/govindjangid75/College-Event-Management/tree/govind`
- **Work Completed This Week:**
  > Implemented Hybrid Event Recommender algorithm using cosine similarity between student interests and event tags combined with attendance history. Built floating Campus Concierge AI Chatbot with multi-turn Hinglish/English RAG grounded in Arya College events. Integrated AI Event Proposal Copilot panel into the event wizard.
- **Problems Faced:**
  > Handling cold-start recommendations for first-year students with empty attendance history.
- **Plan for Next Week:**
  > Build Three.js 3D campus twin, dual-mode dashboard, Docker production stack, and final release.

### 🔹 Week 12: 3D Campus Twin, Dual-Mode Dashboard & Final Release
- **Week:** `Week 12`
- **Date Range:** `21 Sep 2026 – 07 Oct 2026`
- **GitHub / Report Link:** `https://github.com/govindjangid75/College-Event-Management/tree/govind`
- **Work Completed This Week:**
  > Built interactive Three.js 3D Campus Digital Twin (`/campus-3d`) with low-poly buildings, pulsing event beacons, and camera tweening. Transformed Home Page into a dual-mode portal with a role-based Personal Command Dashboard. Resolved past events registration bug by strictly closing registrations on concluded events. Authored multi-stage Dockerfiles, NGINX TLS 1.3 reverse proxy, and GitHub Actions CI/CD. Completed 36-page Final Project Report and Viva slide deck. Production release v1.0.0-PROD.
- **Problems Faced:**
  > Optimizing WebGL draw calls for mobile phones; fixing dark mode contrast on comparison cards.
- **Plan for Next Week:**
  > Submit final report to CSE Department, present in Final Viva Examination, and deploy live on Arya College infrastructure.
