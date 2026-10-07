# CampusSphere: REST API Specification (OpenAPI / Swagger Standard)
**Base URL:** `https://campussphere.aryacollege.in/api/v1` (Local: `http://localhost:8080/api/v1` or `http://localhost:5000/api/v1`)  
**Specification Version:** 1.0.0-PROD  
**Content-Type:** `application/json`  
**Authentication:** HTTP Bearer Header (`Authorization: Bearer <JWT_ACCESS_TOKEN>`)  

---

## 1. Global Response Envelope & Error Codes

### Standard Success Envelope
```json
{
  "success": true,
  "status_code": 200,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-03-15T10:00:00.000Z"
}
```

### Standard Error Envelope
```json
{
  "success": false,
  "status_code": 403,
  "error_code": "VERIFIED_ATTENDANCE_REQUIRED",
  "message": "Only students with verified gate check-in can submit feedback.",
  "errors": [],
  "timestamp": "2026-03-15T10:00:00.000Z"
}
```

---

## 2. Authentication & Identity Endpoints

### 2.1 Register New Student
* **Endpoint:** `POST /auth/register`
* **Access:** Public
* **Request Body:**
```json
{
  "name": "Govind Jangid",
  "email": "govind.sharma@aryacollege.in",
  "password": "SecurePassword@123",
  "roll_no": "22EACIT089",
  "department": "Computer Science & Engineering",
  "semester": 6,
  "interests": ["Coding", "Hackathons", "Esports", "Web3"]
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "status_code": 201,
  "message": "Student registered successfully. Verification token dispatched.",
  "data": {
    "user_id": "65b9e1a89c1d4f0012e84a01",
    "email": "govind.sharma@aryacollege.in",
    "role": "STUDENT"
  }
}
```

### 2.2 User Login
* **Endpoint:** `POST /auth/login`
* **Access:** Public
* **Request Body:**
```json
{
  "email": "govind.sharma@aryacollege.in",
  "password": "SecurePassword@123"
}
```
* **Response (200 OK):** *(Sets HttpOnly cookie `refreshToken`)*
```json
{
  "success": true,
  "status_code": 200,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzUxMi...",
    "expires_in": 900,
    "user": {
      "id": "65b9e1a89c1d4f0012e84a01",
      "name": "Govind Jangid",
      "email": "govind.sharma@aryacollege.in",
      "role": "STUDENT",
      "roll_no": "22EACIT089",
      "department": "Computer Science & Engineering",
      "activity_points_total": 45
    }
  }
}
```

### 2.3 Rotate Refresh Token
* **Endpoint:** `POST /auth/refresh`
* **Access:** Public (Reads cookie `refreshToken`)
* **Response (200 OK):**
```json
{
  "success": true,
  "status_code": 200,
  "data": {
    "access_token": "eyJhbGciOiJIUzUxMi...",
    "expires_in": 900
  }
}
```

---

## 3. Clubs & Treasury Endpoints

### 3.1 List All 15 Clubs
* **Endpoint:** `GET /clubs`
* **Access:** Public
* **Query Params:** `?category=Coding`
* **Response (200 OK):**
```json
{
  "success": true,
  "status_code": 200,
  "data": [
    {
      "id": "65b9e2001",
      "slug": "arya_cipher",
      "name": "Arya Cipher Coding Club",
      "category": "Coding / Development",
      "description": "Algorithmic coding, web engineering, and hackathon community.",
      "logo_url": "/assets/clubs/cipher.png",
      "banner_url": "/assets/banners/cipher.jpg",
      "faculty_coordinator": "Dr. R. K. Gupta",
      "total_events_hosted": 14,
      "active_members_count": 280
    }
  ]
}
```

### 3.2 Get Club Profile & Treasury (Club Admin)
* **Endpoint:** `GET /clubs/:id/treasury`
* **Access:** `CLUB_ADMIN` (Own club) or `SUPER_ADMIN`
* **Response (200 OK):**
```json
{
  "success": true,
  "status_code": 200,
  "data": {
    "club_id": "65b9e2001",
    "club_name": "Arya Cipher Coding Club",
    "treasury": {
      "total_revenue": 54200.00,
      "available_balance": 48600.00,
      "pending_settlement": 5600.00,
      "payout_upi_id": "aryacipher@okhdfcbank"
    },
    "recent_ledger_entries": [
      {
        "id": "65b9f101",
        "timestamp": "2026-03-15T09:30:00Z",
        "type": "TICKET_SALE",
        "event_title": "Arya HackSprint 2026",
        "credit": 245.00,
        "debit": 0.00,
        "running_balance": 48600.00,
        "remarks": "Ticket #8942 - Student Govind Jangid"
      }
    ]
  }
}
```

---

## 4. Venues & Conflict Engine Endpoints

### 4.1 Check Venue Availability & 30-min Buffer
* **Endpoint:** `POST /venues/check-conflict`
* **Access:** Authenticated
* **Request Body:**
```json
{
  "venue_id": "65b9e3001",
  "start_time": "2026-03-15T09:00:00Z",
  "end_time": "2026-03-16T21:00:00Z"
}
```
* **Response (200 OK - No Clash):**
```json
{
  "success": true,
  "status_code": 200,
  "data": {
    "available": true,
    "venue_name": "Dr. Radhakrishnan Central Auditorium",
    "buffer_window": {
      "setup_start": "2026-03-15T08:30:00Z",
      "teardown_end": "2026-03-16T21:30:00Z"
    }
  }
}
```
* **Response (409 Conflict):**
```json
{
  "success": false,
  "status_code": 409,
  "error_code": "VENUE_BUFFER_COLLISION",
  "message": "Requested slot overlaps with buffer of 'Arya Annual Dance Fest' ending at 08:45 AM.",
  "data": {
    "conflicting_event": "Arya Annual Dance Fest",
    "available_alternatives": ["Seminar Hall A", "Block B Audi"]
  }
}
```

---

## 5. Event Management Endpoints

### 5.1 Create Event Proposal
* **Endpoint:** `POST /events`
* **Access:** `CLUB_ADMIN`
* **Request Body:**
```json
{
  "club_id": "65b9e2001",
  "title": "Arya HackSprint 2026",
  "category": "Hackathons",
  "tags": ["Hackathon", "AI", "Web3"],
  "venue_id": "65b9e3001",
  "short_summary": "36-hour non-stop hackathon with ₹1,00,000 in cash prizes.",
  "description_markdown": "# Rules and Guidelines...",
  "banner_image": "/assets/events/hacksprint.png",
  "start_time": "2026-03-15T09:00:00Z",
  "end_time": "2026-03-16T21:00:00Z",
  "registration_type": "TEAM",
  "team_size_limits": { "min": 2, "max": 4 },
  "is_paid": true,
  "ticket_price": 250.00,
  "max_capacity": 400,
  "activity_points_awarded": 25
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "status_code": 201,
  "message": "Event proposal submitted for Super Admin approval.",
  "data": {
    "id": "65b9e4001",
    "slug": "arya-hacksprint-2026",
    "status": "PENDING_APPROVAL"
  }
}
```

### 5.2 Super Admin Approve / Reject Event
* **Endpoint:** `PATCH /events/:id/status`
* **Access:** `SUPER_ADMIN`
* **Request Body:**
```json
{
  "status": "APPROVED",
  "comments": "Approved. Central Auditorium reserved with full AV support."
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "status_code": 200,
  "message": "Event status updated to APPROVED."
}
```

---

## 6. Registration & Dynamic Rolling QR Endpoints

### 6.1 Solo Registration
* **Endpoint:** `POST /registrations/solo`
* **Access:** `STUDENT`
* **Request Body:**
```json
{
  "event_id": "65b9e4001"
}
```
* **Response (200 OK - Free Event):**
```json
{
  "success": true,
  "status_code": 200,
  "message": "Registration confirmed.",
  "data": {
    "registration_id": "65b9e5001",
    "ticket_number": "CS-TKT-2026-8942",
    "status": "CONFIRMED"
  }
}
```

### 6.2 Get Live 30-Second Rolling HMAC QR Token
* **Endpoint:** `GET /registrations/:id/dynamic-qr`
* **Access:** Authenticated (Ticket owner or Club Admin)
* **Response (200 OK):**
```json
{
  "success": true,
  "status_code": 200,
  "data": {
    "ticket_number": "CS-TKT-2026-8942",
    "token_payload": "eyJ0a3QiOiJDUy1US1QtMjAyNi04OTQyIiwidWlkIjoiNjViOWUxYSIsInRzIjoxNzc0ODI5MTAsInNpZyI6ImE5ZjNiNy4uLiJ9",
    "valid_for_seconds": 24,
    "window_expires_at": "2026-03-15T09:15:30Z"
  }
}
```

---

## 7. Payments & Razorpay Integration Endpoints

### 7.1 Create Razorpay Order
* **Endpoint:** `POST /payments/create-order`
* **Access:** `STUDENT`
* **Request Body:**
```json
{
  "event_id": "65b9e4001",
  "registration_type": "SOLO"
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "status_code": 200,
  "data": {
    "order_id": "order_NzK8723kL",
    "amount": 25000,
    "currency": "INR",
    "key_id": "rzp_test_4kL89...",
    "club_name": "Arya Cipher Coding Club"
  }
}
```

### 7.2 Verify Payment Signature & Issue Ticket
* **Endpoint:** `POST /payments/verify-signature`
* **Access:** `STUDENT`
* **Request Body:**
```json
{
  "razorpay_order_id": "order_NzK8723kL",
  "razorpay_payment_id": "pay_NzK9982jK",
  "razorpay_signature": "89ab8c34f89d..."
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "status_code": 200,
  "message": "Payment verified and credited to Arya Cipher Coding Club ledger.",
  "data": {
    "ticket_number": "CS-TKT-2026-8942",
    "status": "CONFIRMED"
  }
}
```

---

## 8. Live Gate Attendance Scanner Endpoints

### 8.1 Verify Dynamic QR at Venue Gate
* **Endpoint:** `POST /attendance/verify-scan`
* **Access:** `CLUB_ADMIN` (Organizing club) or `SUPER_ADMIN`
* **Request Body:**
```json
{
  "event_id": "65b9e4001",
  "scanned_token": "eyJ0a3QiOiJDUy1US1QtMjAyNi04OTQyIiwidWlkIjoiNjViOWUxYSIsInRzIjoxNzc0ODI5MTAsInNpZyI6ImE5ZjNiNy4uLiJ9"
}
```
* **Response (200 OK - Valid Entry):**
```json
{
  "success": true,
  "status_code": 200,
  "message": "Entry approved. Welcome, Govind Jangid!",
  "data": {
    "student_name": "Govind Jangid",
    "roll_no": "22EACIT089",
    "ticket_number": "CS-TKT-2026-8942",
    "checked_in_at": "2026-03-15T09:15:12Z",
    "live_attendee_count": 184
  }
}
```
* **Response (409 Conflict - Duplicate Gate Scan):**
```json
{
  "success": false,
  "status_code": 409,
  "error_code": "DUPLICATE_CHECK_IN",
  "message": "Already checked in at 09:14:02 AM. Duplicate scan rejected.",
  "data": {
    "student_name": "Govind Jangid",
    "initial_checkin_time": "2026-03-15T09:14:02Z"
  }
}
```

---

## 9. Verified Feedback & "You Said, We Did" Endpoints

### 9.1 Submit 5-Factor Verified Feedback
* **Endpoint:** `POST /feedback/submit`
* **Access:** `STUDENT` (Strict Attendance Verification Guard)
* **Request Body:**
```json
{
  "event_id": "65b9e4001",
  "ratings": {
    "overall": 5,
    "content_depth": 5,
    "organization": 4,
    "speaker_quality": 5,
    "venue_facilities": 4,
    "value_for_time": 5
  },
  "review_text": "Incredible hackathon! The mentorship rounds were extremely helpful. Wi-Fi had a slight drop at 3 AM in Hall B, but overall fantastic.",
  "is_anonymous": false
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "status_code": 201,
  "message": "Feedback recorded with Verified Attendee badge.",
  "data": {
    "sentiment_label": "POSITIVE",
    "sentiment_score": 0.88
  }
}
```

### 9.2 Upvote Suggestion
* **Endpoint:** `POST /suggestions/:id/upvote`
* **Access:** `STUDENT`
* **Response (200 OK):**
```json
{
  "success": true,
  "status_code": 200,
  "data": {
    "suggestion_id": "65b9f7001",
    "upvotes_count": 49
  }
}
```

---

## 10. Certificates & Public Verification Endpoints

### 10.1 Public Certificate Verification
* **Endpoint:** `GET /certificates/verify/:certId`
* **Access:** Public (No authentication required)
* **Response (200 OK):**
```json
{
  "success": true,
  "status_code": 200,
  "data": {
    "is_valid": true,
    "certificate_id": "CS-ARYA-2026-HACK-0142",
    "student_name": "Govind Jangid",
    "roll_no": "22EACIT089",
    "event_title": "Arya HackSprint 2026",
    "organizing_club": "Arya Cipher Coding Club",
    "activity_points_awarded": 25,
    "issued_at": "2026-03-18T12:00:00Z",
    "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
}
```

---

## 11. Campus AI Intelligence Suite Endpoints

### 11.1 Generate AI Event Proposal Draft
* **Endpoint:** `POST /api/ai/copilot/generate-event`
* **Access:** `CLUB_ADMIN`, `SUPER_ADMIN`
* **Request Body:**
```json
{
  "prompt": "36-hr AI & Web3 Hackathon for 300 students with cash prizes",
  "clubId": "6ac5048e9e7f6659899e6cdb",
  "category": "TECHNICAL"
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "status_code": 200,
  "data": {
    "suggestedTitle": "Arya HackSprint 2026: GenAI & Web3 Innovation Marathon",
    "suggestedCategory": "HACKATHON",
    "suggestedPoints": 25,
    "recommendedCapacity": 300,
    "idealVenueName": "Central Auditorium & Computer Labs 1-4",
    "tags": ["Hackathon", "GenAI", "Web3", "Smart Contracts", "ACEIT"],
    "shortSummary": "A high-octane 36-hour hackathon bringing together creative minds to build autonomous agents and decentralized systems.",
    "descriptionMarkdown": "# Arya HackSprint 2026\n\n## Overview\nJoin 300+ builders for an exhilarating 36-hour development sprint...\n\n### Tracks\n1. Autonomous AI Agents\n2. Decentralized Applications & Web3\n3. Smart Campus & IoT\n\n### Rules\n- Teams of 2 to 4 members\n- Fresh code written during the marathon\n- Final presentations evaluated by industry tech leaders"
  }
}
```

### 11.2 Campus Concierge Conversational Chatbot
* **Endpoint:** `POST /api/ai/concierge/chat`
* **Access:** Public / Authenticated
* **Request Body:**
```json
{
  "message": "Next week koi coding event hai kya Arya college me?",
  "userId": "user_student_1",
  "history": []
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "status_code": 200,
  "data": {
    "reply": "Haan! Next week **Arya HackSprint 2026** scheduled hai (organized by Arya Cipher Coding Club). Isme 25 AICTE Activity Points milenge aur Dr. Radhakrishnan Central Auditorium me hoga.",
    "intent": "EVENT_DISCOVERY",
    "quickReplies": ["View Event Pass", "Explore Clubs", "How many AICTE points?"],
    "actionLinks": [
      {
        "label": "View Upcoming Events",
        "url": "/events",
        "action": "NAVIGATE"
      }
    ]
  }
}
```

### 11.3 Personalized Student Recommendations
* **Endpoint:** `GET /api/ai/recommendations/{userId}`
* **Access:** `STUDENT`
* **Response (200 OK):**
```json
{
  "success": true,
  "status_code": 200,
  "data": [
    {
      "id": "6ac5048e9e7f6659899e6cf1",
      "title": "Arya HackSprint 2026",
      "category": "HACKATHON",
      "matchScore": 98,
      "matchReason": "Strong match with your CSE Department and Competitive Coding & Web3 interests."
    }
  ]
}
```

---
*End of REST API Specification. Fully compliant with OpenAPI / Swagger standards.*
