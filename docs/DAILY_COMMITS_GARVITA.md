# Garvita Jain — 94-Day Backend Development Log

### Day 1 (Sprint Day 1) — setup spring boot 3.3.4 project on java 21 with maven wrapper
- **Timestamp:** `2026-10-07T09:15:00+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented setup spring boot 3.3.4 project on java 21 with maven wrapper
- **Files touched:** server/pom.xml, server/mvnw, server/mvnw.cmd, server/.mvn/wrapper/maven-wrapper.properties, server/.gitignore

### Day 2 (Sprint Day 2) — configure application.properties with mongodb connection string
- **Timestamp:** `2026-10-07T09:22:20+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented configure application.properties with mongodb connection string
- **Files touched:** server/src/main/resources/application.properties, docs/ERD.md

### Day 3 (Sprint Day 3) — create base project package structure and cors filter configuration
- **Timestamp:** `2026-10-07T09:29:40+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented create base project package structure and cors filter configuration
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/CampusSphereApplication.java, server/src/main/java/com/aryacollege/campussphere/config/CorsConfig.java

### Day 4 (Sprint Day 4) — setup gradle build configuration and dependencies
- **Timestamp:** `2026-10-07T09:37:00+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented setup gradle build configuration and dependencies
- **Files touched:** server/build.gradle, server/settings.gradle

### Day 5 (Sprint Day 5) — setup junit 5 backend test scaffold
- **Timestamp:** `2026-10-07T09:44:20+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented setup junit 5 backend test scaffold
- **Files touched:** server/src/test/java/com/aryacollege/campussphere/CampusSphereApplicationTests.java

### Day 6 (Sprint Day 6) — write backend requirements in srs doc
- **Timestamp:** `2026-10-07T09:51:40+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented write backend requirements in srs doc
- **Files touched:** docs/SRS.md

### Day 7 (Sprint Day 7) — document security architecture and stride threat model
- **Timestamp:** `2026-10-07T09:59:00+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented document security architecture and stride threat model
- **Files touched:** docs/SECURITY_ARCHITECTURE.md

### Day 8 (Sprint Day 8) — implement user model with roles for student, club admin and dean
- **Timestamp:** `2026-10-07T10:06:20+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented implement user model with roles for student, club admin and dean
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/model/User.java

### Day 9 (Sprint Day 9) — create user repository with mongo queries for email and roll no
- **Timestamp:** `2026-10-07T10:13:40+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented create user repository with mongo queries for email and roll no
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/repository/UserRepository.java

### Day 10 (Sprint Day 10) — implement standardized api response payload dto
- **Timestamp:** `2026-10-07T10:21:00+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented implement standardized api response payload dto
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/dto/ApiResponse.java

### Day 11 (Sprint Day 11) — implement student registration service layer
- **Timestamp:** `2026-10-07T10:28:20+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented implement student registration service layer
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/service/RegistrationService.java

### Day 12 (Sprint Day 12) — build registration rest controller endpoint
- **Timestamp:** `2026-10-07T10:35:40+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented build registration rest controller endpoint
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/controller/RegistrationController.java

### Day 13 (Sprint Day 13) — add registration request payload dto with validation rules
- **Timestamp:** `2026-10-07T10:43:00+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented add registration request payload dto with validation rules
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/dto/RegistrationRequestDto.java

### Day 14 (Sprint Day 14) — document auth and registration apis in api specification
- **Timestamp:** `2026-10-07T10:50:20+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented document auth and registration apis in api specification
- **Files touched:** docs/API_SPECIFICATION.md

### Day 15 (Sprint Day 15) — design club entity model with category, lead and budget fields
- **Timestamp:** `2026-10-07T10:57:40+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented design club entity model with category, lead and budget fields
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/model/Club.java

### Day 16 (Sprint Day 16) — implement club repository with mongo queries by category
- **Timestamp:** `2026-10-07T11:05:00+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented implement club repository with mongo queries by category
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/repository/ClubRepository.java

### Day 17 (Sprint Day 17) — create club service layer with get all and get by id methods
- **Timestamp:** `2026-10-07T11:12:20+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented create club service layer with get all and get by id methods
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/service/ClubService.java

### Day 18 (Sprint Day 18) — build club rest controller with category filter endpoint
- **Timestamp:** `2026-10-07T11:19:40+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented build club rest controller with category filter endpoint
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/controller/ClubController.java

### Day 19 (Sprint Day 19) — create club application model for collegiate societies
- **Timestamp:** `2026-10-07T11:27:00+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented create club application model for collegiate societies
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/model/ClubApplication.java

### Day 20 (Sprint Day 20) — implement club application repository for pending submissions
- **Timestamp:** `2026-10-07T11:34:20+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented implement club application repository for pending submissions
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/repository/ClubApplicationRepository.java

### Day 21 (Sprint Day 21) — implement database seeder service for 15 collegiate societies
- **Timestamp:** `2026-10-07T11:41:40+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented implement database seeder service for 15 collegiate societies
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/service/DatabaseSeederService.java

### Day 22 (Sprint Day 22) — design venue model with name, capacity and location coordinates
- **Timestamp:** `2026-10-07T11:49:00+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented design venue model with name, capacity and location coordinates
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/model/Venue.java

### Day 23 (Sprint Day 23) — create venue repository with active status filtering
- **Timestamp:** `2026-10-07T11:56:20+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented create venue repository with active status filtering
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/repository/VenueRepository.java

### Day 24 (Sprint Day 24) — build institutional 30-minute venue buffer conflict engine service
- **Timestamp:** `2026-10-07T12:03:40+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented build institutional 30-minute venue buffer conflict engine service
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/service/VenueClashEngineService.java

### Day 25 (Sprint Day 25) — create venue clash check input dto with date range fields
- **Timestamp:** `2026-10-07T12:11:00+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented create venue clash check input dto with date range fields
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/dto/VenueClashCheckDto.java

### Day 26 (Sprint Day 26) — create venue clash result dto with conflict details
- **Timestamp:** `2026-10-07T12:18:20+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented create venue clash result dto with conflict details
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/dto/VenueClashResultDto.java

### Day 27 (Sprint Day 27) — build venue rest controller listing available college halls
- **Timestamp:** `2026-10-07T12:25:40+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented build venue rest controller listing available college halls
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/controller/VenueController.java

### Day 28 (Sprint Day 28) — design event entity model with date, venue, capacity and price
- **Timestamp:** `2026-10-07T12:33:00+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented design event entity model with date, venue, capacity and price
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/model/Event.java

### Day 29 (Sprint Day 29) — implement event repository with queries for upcoming fests
- **Timestamp:** `2026-10-07T12:40:20+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented implement event repository with queries for upcoming fests
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/repository/EventRepository.java

### Day 30 (Sprint Day 30) — create event proposal dto with budget and venue breakdown
- **Timestamp:** `2026-10-07T12:47:40+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented create event proposal dto with budget and venue breakdown
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/dto/EventProposalDto.java

### Day 31 (Sprint Day 31) — build event proposal submission and approval service
- **Timestamp:** `2026-10-07T12:55:00+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented build event proposal submission and approval service
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/service/EventService.java

### Day 32 (Sprint Day 32) — build event rest controller with search and category filters
- **Timestamp:** `2026-10-07T13:02:20+05:30`
- **Lead:** Garvita Jain (Backend Lead)
- **Action:** Implemented build event rest controller with search and category filters
- **Files touched:** server/src/main/java/com/aryacollege/campussphere/controller/EventController.java

