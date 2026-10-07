# CampusSphere: AICTE / RTU Activity Points Specification
**Academic Standards:** AICTE Mandatory Extracurricular Norms & RTU Degree Honors Policy  
**Target Institution:** Arya College of Engineering & IT (ACEIT), Jaipur  
**Version:** 1.0.0-PROD  
**Status:** Approved  

---

## 1. Regulatory Context & Academic Objectives

Under AICTE guidelines and Rajasthan Technical University (RTU) ordinances, every undergraduate B.Tech student must earn a minimum of **100 Activity Points** (75 points for lateral entry students) over their 4-year degree course to qualify for the **B.Tech Degree with Honors / Graduation Clearance**.

Currently, colleges struggle with:
* Disjointed paper certificates presented in final year.
* Loss of physical certificates from 1st and 2nd years.
* Disputed point weightages.
* Massive manual verification burden on HODs and examination cells.

CampusSphere fully automates the earning, auditing, and official transcript generation of these activity points.

---

## 2. Activity Point Matrix by Event Category

Approved events on CampusSphere are assigned standardized point values based on level, duration, and intensity:

| Category Code | Domain | Event Types | Eligible Arya Clubs | Points Awarded |
|---|---|---|---|:---:|
| `ACT_TECH_HACK` | Technical Innovation | 24–36h National Hackathons | Arya ACEIT Hackathon Club, Cipher Club | **25 pts** |
| `ACT_TECH_WKSP` | Technical Innovation | Hands-on Bootcamps & Workshops (>8h) | Cipher, Drones, Robotics, Automation, IoT | **15 pts** |
| `ACT_TECH_COMP` | Technical Innovation | Coding Contests, Robo-Wars, FPV Racing | SciTech, LINCOM, Robotics, Drones | **10 pts** |
| `ACT_SOC_CSR`   | Social Welfare / CSR | Blood Donation Drives, Rural Tech Camp | Arya Social Activities Club | **20 pts** |
| `ACT_SOC_ENV`   | Sustainability & Nature| Tree Plantation, Solar Energy Expo    | Green Energy Club, Social Club | **15 pts** |
| `ACT_LIT_DEB`   | Literary & Leadership | MUN, Parliamentary Debate, Elocution  | Arya Literature Club | **15 pts** |
| `ACT_CULT_FEST` | Cultural Arts         | Inter-college Fest, Band / Dance Comp | Arya Dance Club, Arya Music Club | **15 pts** |
| `ACT_SPRT_TOUR` | Sports & Mind Games   | FIDE Chess Tournament, Esports LAN Fest| Chess Club, Arya E-Sports Club | **10 pts** |

---

## 3. Automated Point Crediting Lifecycle

```
[ Club Proposes Event with Target Category & Points ]
                         |
                         v
[ Super Admin (Dean / HOD) Reviews & Approves Weightage ]
                         |
                         v
[ Student Registers & Attends Event ]
                         |
                         v
[ Live Gate Scanner Verifies Attendance ]
                         |
                         v
[ Event Concludes -> Status transitions to COMPLETED ]
                         |
                         v
+-------------------------------------------------------------+
| AUTOMATED ENGINE EXECUTES IN BACKGROUND:                     |
| 1. Iterates verified attendees in `attendance_records`.     |
| 2. Appends entry to `activity_points_ledger`.               |
| 3. Atomically increments `activity_points_total` on User.   |
| 4. Dispatches push notification to student:                 |
|    "Congratulations! You earned 25 AICTE Activity Points."  |
| 5. Embeds point verification seal into E-Certificate.       |
+-------------------------------------------------------------+
```

---

## 4. Official Activity Points Transcript Format

Students and academic advisors can export a tamper-evident **Official Extracurricular & Activity Points Transcript** at any time.

### Transcript Layout:
* **Header:** Arya College of Engineering & IT, Jaipur ? Office of the Dean (Academics).
* **Student Metadata:** Name, University Roll No, Branch, Batch, Semester.
* **Cumulative Summary Table:**
  - Technical Innovation: `40 / 40 pts` (Cap applied)
  - Social & Community Service: `20 / 30 pts`
  - Literary & Cultural: `15 / 20 pts`
  - Sports & Mind Games: `10 / 10 pts`
  - **Grand Total: `85 / 100 pts`** (Status: *On track for Degree Honors*)
* **Itemized Activity Log:** Event Name, Organizing Club, Date Attended, Gate Verification Timestamp, Certificate ID, Points Earned.
* **Verification QR Code:** Scannable code pointing directly to `https://campussphere.aryacollege.in/transcript/verify/:studentRollNo`.

---
*End of AICTE Activity Points Specification.*
