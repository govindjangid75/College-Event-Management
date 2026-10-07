package com.aryacollege.campussphere.service;

import com.aryacollege.campussphere.model.*;
import com.aryacollege.campussphere.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class DatabaseSeederService implements CommandLineRunner {

    private final ClubRepository clubRepository;
    private final VenueRepository venueRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final ClubLedgerRepository clubLedgerRepository;
    private final com.aryacollege.campussphere.repository.RegistrationRepository registrationRepository;
    private final VerifiedFeedbackRepository feedbackRepository;
    private final StudentSuggestionRepository suggestionRepository;
    private final CertificateRepository certificateRepository;

    @Override
    public void run(String... args) {
        log.info("Checking MongoDB Atlas institutional dataset for Arya College...");

        // 1. Seed Venues if empty
        if (venueRepository.count() == 0) {
            log.info("Seeding Arya College Venues into MongoDB Atlas...");
            seedVenues();
        }

        // 2. Seed Master 15 Clubs (refresh if using older faculty names)
        if (clubRepository.count() == 0 || clubRepository.findAll().stream().anyMatch(c -> c.getFacultyCoordinator() != null && c.getFacultyCoordinator().contains("Mittal"))) {
            log.info("Refreshing Master 15 Arya College Clubs with official HODs into MongoDB Atlas...");
            clubRepository.deleteAll();
            seedClubs();
        }

        // 3. Seed Users if empty
        if (userRepository.count() == 0 || userRepository.findAll().stream().anyMatch(u -> "Dr. R. K. Sharma".equals(u.getName()))) {
            log.info("Refreshing Demo Personas into MongoDB Atlas with Prof. (Dr.) Arun Arya...");
            userRepository.deleteAll();
            seedUsers();
        }

        // 4. Seed Initial Events (refresh if missing official SIH 2026 event or completed archives)
        if (eventRepository.count() == 0 || eventRepository.findByStatus("COMPLETED").isEmpty()) {
            log.info("Refreshing Institutional Events with official Arya Events into MongoDB Atlas...");
            eventRepository.deleteAll();
            seedEvents();
        }

        // 5. Seed initial demo registration for student if empty
        if (registrationRepository.count() == 0) {
            log.info("Seeding Initial Student Registration & Dynamic Pass into MongoDB Atlas...");
            seedRegistrations();
        }

        // 6. Seed Initial Verified Feedback & Suggestions if empty
        if (feedbackRepository.count() == 0) {
            log.info("Seeding Initial Attendance-Gated Verified Feedback into MongoDB Atlas...");
            seedFeedbacks();
        }

        if (suggestionRepository.count() == 0) {
            log.info("Seeding Initial Student Suggestions & You-Said-We-Did Kanban into MongoDB Atlas...");
            seedSuggestions();
        }

        // 7. Seed Initial Cryptographically Sealed Certificate if empty
        if (certificateRepository.count() == 0) {
            log.info("Seeding Initial Verifiable Certificate into MongoDB Atlas...");
            seedCertificates();
        }

        log.info("MongoDB Atlas initialization complete. Live cloud data active!");
    }


    private void seedVenues() {
        List<Venue> venues = List.of(
            Venue.builder()
                .code("AUDI_MAIN")
                .name("Dr. Radhakrishnan Central Auditorium")
                .capacity(850)
                .location("Central Campus, Block C")
                .facilities(List.of("Dual 4K Laser Projectors", "5.1 Surround Sound", "Stage Lighting", "Central AC", "Gigabit Wi-Fi"))
                .active(true)
                .build(),
            Venue.builder()
                .code("SEM_A")
                .name("Ramanujan Seminar Hall A")
                .capacity(220)
                .location("Academic Block A, 1st Floor")
                .facilities(List.of("Podium Mic", "Smart Interactive Board", "Acoustic Wall Panels", "AC"))
                .active(true)
                .build(),
            Venue.builder()
                .code("SEM_B")
                .name("Homi Bhabha Seminar Hall B")
                .capacity(180)
                .location("Academic Block B, Ground Floor")
                .facilities(List.of("High-Lumen Projector", "Wireless Handheld Mics", "AC"))
                .active(true)
                .build(),
            Venue.builder()
                .code("LAB_TURING")
                .name("Turing Advanced Computing Lab")
                .capacity(90)
                .location("Block B, 2nd Floor")
                .facilities(List.of("90x Intel Core i7 Workstations", "Gigabit LAN", "Dual Monitors", "Server Terminal"))
                .active(true)
                .build(),
            Venue.builder()
                .code("LAB_ARYABHATTA")
                .name("Aryabhatta Electronics & IoT Innovation Lab")
                .capacity(65)
                .location("Block D, Ground Floor")
                .facilities(List.of("Soldering Stations", "Digital Storage Oscilloscopes", "Raspberry Pi & Arduino Kits", "3D Printers"))
                .active(true)
                .build(),
            Venue.builder()
                .code("LAWN_CENTRAL")
                .name("Arya Central Open Amphitheater & Lawn")
                .capacity(1500)
                .location("Central Green Courtyard")
                .facilities(List.of("Open Air Stage", "Concert Line-Array Mounts", "High-Mast Floodlights", "Generator Backup"))
                .active(true)
                .build()
        );
        venueRepository.saveAll(venues);
    }

    private void seedClubs() {
        List<Club> clubs = List.of(
            Club.builder()
                .slug("arya_scitech")
                .name("Arya Science & Technology Club")
                .category("Science & Tech")
                .tagline("Fostering Scientific Temper & Disruptive Innovations")
                .description("Premier scientific exploration society organizing national science symposiums, patent mentorship workshops, and technical exhibits at Arya College.")
                .logoUrl("https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=200")
                .bannerUrl("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200")
                .facultyCoordinator("Dr. Devendra Kumar Singhal (HOD, Basic Science & Humanities)")
                .studentLeads(List.of("Aarav Mehta", "Ananya Gupta"))
                .treasury(Club.Treasury.builder().totalRevenue(28400).availableBalance(24500).pendingSettlement(3900).payoutUpiId("aryascitech@okhdfcbank").build())
                .memberCount(310).eventsHostedCount(12)
                .socialLinks(Map.of("instagram", "https://instagram.com/aryascitech", "linkedin", "https://linkedin.com/company/aryascitech"))
                .recruitmentStatus("OPEN").meetingSchedule("Wednesdays at 4:30 PM (Block A)").createdAt(Instant.now()).build(),

            Club.builder()
                .slug("arya_cipher")
                .name("Arya Cipher Coding Club")
                .category("Coding / Dev")
                .tagline("Code. Compile. Conquer.")
                .description("Flagship developer society championing Data Structures, Algorithms, Open Source, Web3, and national hackathon representation.")
                .logoUrl("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=200")
                .bannerUrl("https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200")
                .facultyCoordinator("Prof. (Dr.) Akhil Pandey (HOD, Computer Science & Engineering)")
                .studentLeads(List.of("Priya Verma (President)", "Govind Jangid (Tech Lead)"))
                .treasury(Club.Treasury.builder().totalRevenue(78500).availableBalance(69200).pendingSettlement(9300).payoutUpiId("aryacipher@okhdfcbank").build())
                .memberCount(520).eventsHostedCount(22)
                .socialLinks(Map.of("github", "https://github.com/arya-cipher", "instagram", "https://instagram.com/aryacipher"))
                .recruitmentStatus("OPEN").meetingSchedule("Wednesdays at 4:30 PM (CS Lab 2)").createdAt(Instant.now()).build(),

            Club.builder()
                .slug("arya_aceit_hack")
                .name("Arya ACEIT Hackathon Club")
                .category("Hackathons")
                .tagline("36 Hours of Non-stop Innovation & Sprinting")
                .description("Dedicated hackathon incubation wing driving internal sprint challenges, Smart India Hackathon (SIH) bootcamps, and industrial problem sprints.")
                .logoUrl("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=200")
                .bannerUrl("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200")
                .facultyCoordinator("Prof. Neha Agarwal (Lead Mentor, MSME Arya Incubation Centre)")
                .studentLeads(List.of("Rohan Singhania", "Megha Joshi"))
                .treasury(Club.Treasury.builder().totalRevenue(142000).availableBalance(125000).pendingSettlement(17000).payoutUpiId("aceithack@icici").build())
                .memberCount(440).eventsHostedCount(16)
                .socialLinks(Map.of("github", "https://github.com/aceit-hack", "instagram", "https://instagram.com/aceithack"))
                .recruitmentStatus("OPEN").meetingSchedule("Thursdays at 5:00 PM (Lab 4)").createdAt(Instant.now()).build(),

            Club.builder()
                .slug("arya_esports")
                .name("Arya E-Sports Club")
                .category("Gaming / Esports")
                .tagline("Where Gaming Meets High-Stakes Strategy")
                .description("Premier collegiate gaming league organizing collegiate LAN fests in Valorant, BGMI, EA FC, and Rocket League with live tournament streaming.")
                .logoUrl("https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200")
                .bannerUrl("https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1200")
                .facultyCoordinator("Dr. P. C. Gupta (Director, Physical Education & Sports Board)")
                .studentLeads(List.of("Kabir Malhotra", "Arjun Rawat"))
                .treasury(Club.Treasury.builder().totalRevenue(52000).availableBalance(46800).pendingSettlement(5200).payoutUpiId("aryagaming@okhdfcbank").build())
                .memberCount(380).eventsHostedCount(14)
                .socialLinks(Map.of("instagram", "https://instagram.com/arya_esports"))
                .recruitmentStatus("OPEN").meetingSchedule("Saturdays at 2:00 PM (Seminar B)").createdAt(Instant.now()).build(),

            Club.builder()
                .slug("arya_dance")
                .name("Arya Dance Club")
                .category("Cultural")
                .tagline("Expression Through Rhythm & Grace")
                .description("The heartbeat of Arya cultural fests! Classical, street hip-hop, contemporary, and flashmobs representing the college across national platforms.")
                .logoUrl("https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=200")
                .bannerUrl("https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=1200")
                .facultyCoordinator("Dr. Gurpreet Kaur (Convenor, Cultural & Student Affairs)")
                .studentLeads(List.of("Tanya Sen", "Vikram Rathore"))
                .treasury(Club.Treasury.builder().totalRevenue(64000).availableBalance(58000).pendingSettlement(6000).payoutUpiId("aryadance@okhdfcbank").build())
                .memberCount(290).eventsHostedCount(18)
                .socialLinks(Map.of("instagram", "https://instagram.com/arya_dance_club"))
                .recruitmentStatus("OPEN").meetingSchedule("Tuesdays at 4:30 PM (Amphitheater)").createdAt(Instant.now()).build(),

            Club.builder()
                .slug("arya_social")
                .name("Arya Social Activities Club")
                .category("Social Welfare")
                .tagline("Service Above Self for Campus & Community")
                .description("NSS & CSR wing organizing blood donation camps, rural teaching drives, digital literacy camps, and environmental relief initiatives.")
                .logoUrl("https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=200")
                .bannerUrl("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200")
                .facultyCoordinator("Prof. (Dr.) Arun Arya (Dean Academics & Student Welfare)")
                .studentLeads(List.of("Harshita Pareek", "Nitin Soni"))
                .treasury(Club.Treasury.builder().totalRevenue(31000).availableBalance(28500).pendingSettlement(2500).payoutUpiId("aryasocial@okhdfcbank").build())
                .memberCount(410).eventsHostedCount(20)
                .socialLinks(Map.of("instagram", "https://instagram.com/arya_social_welfare"))
                .recruitmentStatus("OPEN").meetingSchedule("Fridays at 3:30 PM").createdAt(Instant.now()).build(),

            Club.builder()
                .slug("arya_lit")
                .name("Arya Literature Club")
                .category("Literary")
                .tagline("Words That Move Minds and Shape Perspectives")
                .description("Home of orators, poets, debaters, and MUN diplomats. Fosters critical dialogue, parliamentary debates, and creative journalism.")
                .logoUrl("https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=200")
                .bannerUrl("https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200")
                .facultyCoordinator("Dr. Devendra Kumar Singhal (HOD, Basic Science & Humanities)")
                .studentLeads(List.of("Siddharth Jain", "Aditi Rao"))
                .treasury(Club.Treasury.builder().totalRevenue(22000).availableBalance(19800).pendingSettlement(2200).payoutUpiId("aryaliterature@okhdfcbank").build())
                .memberCount(220).eventsHostedCount(11)
                .socialLinks(Map.of("instagram", "https://instagram.com/arya_lit_soc"))
                .recruitmentStatus("OPEN").meetingSchedule("Mondays at 4:30 PM (Seminar A)").createdAt(Instant.now()).build(),

            Club.builder()
                .slug("arya_drones")
                .name("Arya Drones Club")
                .category("Aerospace")
                .tagline("Engineering Autonomous Aerial Systems & Robotics")
                .description("Hands-on unmanned aerial vehicles society focusing on quadcopter fabrication, FPV drone racing, autonomous aerial mapping, and telemetry.")
                .logoUrl("https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=200")
                .bannerUrl("https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200")
                .facultyCoordinator("Dr. Sourabh Bhaskar (HOD, Mechanical Engineering)")
                .studentLeads(List.of("Devansh Mathur", "Karan Shekhawat"))
                .treasury(Club.Treasury.builder().totalRevenue(49000).availableBalance(42000).pendingSettlement(7000).payoutUpiId("aryadrones@okhdfcbank").build())
                .memberCount(260).eventsHostedCount(9)
                .socialLinks(Map.of("instagram", "https://instagram.com/arya_drones"))
                .recruitmentStatus("OPEN").meetingSchedule("Saturdays at 11:00 AM (Central Lawn)").createdAt(Instant.now()).build(),

            Club.builder()
                .slug("arya_robotics")
                .name("Robotics Club")
                .category("Robotics")
                .tagline("Designing Autonomous Machines & Combat Arena Bots")
                .description("Hardware prototyping hub for microcontrollers, combat robotics, line followers, and industrial robot arms.")
                .logoUrl("https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=200")
                .bannerUrl("https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=1200")
                .facultyCoordinator("Dr. Rahul Srivastava (HOD, Electronics & Communication)")
                .studentLeads(List.of("Sahil Tiwari", "Rhea Chakraborty"))
                .treasury(Club.Treasury.builder().totalRevenue(41000).availableBalance(36500).pendingSettlement(4500).payoutUpiId("aryarobotics@okhdfcbank").build())
                .memberCount(330).eventsHostedCount(15)
                .socialLinks(Map.of("instagram", "https://instagram.com/arya_robotics"))
                .recruitmentStatus("OPEN").meetingSchedule("Wednesdays at 3:30 PM (IoT Lab)").createdAt(Instant.now()).build(),

            Club.builder()
                .slug("arya_automation")
                .name("Automation Club")
                .category("Industrial Automation")
                .tagline("Bridging Industry 4.0, PLCs and Formula Go-Karts")
                .description("Empowers students with industrial automation skills, PLC/SCADA programming, and automated assembly line simulations.")
                .logoUrl("https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=200")
                .bannerUrl("https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200")
                .facultyCoordinator("Dr. Sourabh Bhaskar (HOD, Mechanical Engineering)")
                .studentLeads(List.of("Mohit Verma", "Pradeep Kumar"))
                .treasury(Club.Treasury.builder().totalRevenue(30000).availableBalance(27000).pendingSettlement(3000).payoutUpiId("aryaautomation@okhdfcbank").build())
                .memberCount(210).eventsHostedCount(8)
                .socialLinks(Map.of("instagram", "https://instagram.com/arya_automation"))
                .recruitmentStatus("OPEN").meetingSchedule("Thursdays at 4:30 PM").createdAt(Instant.now()).build(),

            Club.builder()
                .slug("arya_green")
                .name("Green Energy Club")
                .category("Sustainability")
                .tagline("Pioneering Clean Power & Net-Zero Campus Tech")
                .description("Advocates for clean solar power, electric vehicle (EV) engineering, campus energy audits, and e-waste recycling.")
                .logoUrl("https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=200")
                .bannerUrl("https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200")
                .facultyCoordinator("Prof. (Dr.) Vibhakar Pathak (HOD, Information Technology)")
                .studentLeads(List.of("Ankit Chaudhary", "Pooja Bishnoi"))
                .treasury(Club.Treasury.builder().totalRevenue(24000).availableBalance(21500).pendingSettlement(2500).payoutUpiId("aryagreen@okhdfcbank").build())
                .memberCount(250).eventsHostedCount(10)
                .socialLinks(Map.of("instagram", "https://instagram.com/arya_green_energy"))
                .recruitmentStatus("OPEN").meetingSchedule("Tuesdays at 3:30 PM").createdAt(Instant.now()).build(),

            Club.builder()
                .slug("arya_music")
                .name("Music Club")
                .category("Music")
                .tagline("Harmonizing Passion, Chords & College Spirit")
                .description("Acoustic jams, campus rock bands, classical ragas, and professional audio production.")
                .logoUrl("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=200")
                .bannerUrl("https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=1200")
                .facultyCoordinator("Dr. Gurpreet Kaur (HOD, Management Studies)")
                .studentLeads(List.of("Dhruv Saxena", "Shreya Sen"))
                .treasury(Club.Treasury.builder().totalRevenue(42000).availableBalance(38000).pendingSettlement(4000).payoutUpiId("aryamusic@okhdfcbank").build())
                .memberCount(270).eventsHostedCount(13)
                .socialLinks(Map.of("instagram", "https://instagram.com/arya_music_society"))
                .recruitmentStatus("OPEN").meetingSchedule("Fridays at 5:00 PM (Auditorium)").createdAt(Instant.now()).build(),

            Club.builder()
                .slug("arya_chess")
                .name("Chess Club")
                .category("Mind Sports")
                .tagline("Mastery of Mind, Patience and Strategy")
                .description("Fostering competitive chess, blitz showdowns, FIDE rated masterclasses, and inter-college championships.")
                .logoUrl("https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=200")
                .bannerUrl("https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&q=80&w=1200")
                .facultyCoordinator("Dr. P. C. Gupta (Director, Physical Education & Sports)")
                .studentLeads(List.of("Keshav Bhatt", "Diya Sharma"))
                .treasury(Club.Treasury.builder().totalRevenue(18000).availableBalance(16500).pendingSettlement(1500).payoutUpiId("aryachess@okhdfcbank").build())
                .memberCount(190).eventsHostedCount(7)
                .socialLinks(Map.of("instagram", "https://instagram.com/arya_chess_club"))
                .recruitmentStatus("OPEN").meetingSchedule("Daily at 4:30 PM (Sports Room)").createdAt(Instant.now()).build(),

            Club.builder()
                .slug("arya_iot")
                .name("IoT Club / Arya Intelverse")
                .category("AIoT / Sensors")
                .tagline("Connecting Edge Intelligence & Smart Campus Systems")
                .description("Smart campus sensors, MQTT telemetry, edge computing, ESP32 nodes, and connected hardware solutions.")
                .logoUrl("https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200")
                .bannerUrl("https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=1200")
                .facultyCoordinator("Prof. (Dr.) Ashok Kumar Kajla (HOD, AI & Data Science)")
                .studentLeads(List.of("Vishal Jangid", "Nancy Goyal"))
                .treasury(Club.Treasury.builder().totalRevenue(38000).availableBalance(34000).pendingSettlement(4000).payoutUpiId("aryaiot@okhdfcbank").build())
                .memberCount(310).eventsHostedCount(11)
                .socialLinks(Map.of("instagram", "https://instagram.com/arya_intelverse"))
                .recruitmentStatus("OPEN").meetingSchedule("Thursdays at 3:30 PM (IoT Lab)").createdAt(Instant.now()).build(),

            Club.builder()
                .slug("arya_lincom")
                .name("LINCOM — Arya Linux Community")
                .category("Open Source")
                .tagline("Freedom to Fork, Freedom to Learn")
                .description("Open-source operating systems, Linux kernel compilation, Bash scripting, containerization, and FOSS culture.")
                .logoUrl("https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=200")
                .bannerUrl("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200")
                .facultyCoordinator("Prof. (Dr.) Akhil Pandey (HOD, Computer Science & Engineering)")
                .studentLeads(List.of("Ravi Prakash", "Kritika Saini"))
                .treasury(Club.Treasury.builder().totalRevenue(33000).availableBalance(29500).pendingSettlement(3500).payoutUpiId("aryalincom@okhdfcbank").build())
                .memberCount(340).eventsHostedCount(14)
                .socialLinks(Map.of("github", "https://github.com/arya-lincom", "instagram", "https://instagram.com/arya_lincom"))
                .recruitmentStatus("OPEN").meetingSchedule("Wednesdays at 5:00 PM (Computing Lab)").createdAt(Instant.now()).build()
        );

        clubRepository.saveAll(clubs);

        // Also seed initial ledger transactions
        Club cipher = clubRepository.findBySlug("arya_cipher").orElse(clubs.get(1));
        List<ClubLedgerEntry> entries = List.of(
            ClubLedgerEntry.builder()
                .clubId(cipher.getId()).clubName(cipher.getName()).type("TICKET_SALE")
                .creditAmount(25000).debitAmount(0).gatewayFee(500).netAmount(24500).runningBalance(24500)
                .remarks("Ticket Sales: HackSprint Early Bird (100 Passes)").referenceId("TXN-RZP-8921-CIP")
                .status("SETTLED").timestamp(Instant.now().minus(20, ChronoUnit.DAYS)).build(),
            ClubLedgerEntry.builder()
                .clubId(cipher.getId()).clubName(cipher.getName()).type("TICKET_SALE")
                .creditAmount(35000).debitAmount(0).gatewayFee(700).netAmount(34300).runningBalance(58800)
                .remarks("Ticket Sales: HackSprint Regular Squad Batches").referenceId("TXN-RZP-9104-CIP")
                .status("SETTLED").timestamp(Instant.now().minus(14, ChronoUnit.DAYS)).build(),
            ClubLedgerEntry.builder()
                .clubId(cipher.getId()).clubName(cipher.getName()).type("TICKET_SALE")
                .creditAmount(26000).debitAmount(0).gatewayFee(600).netAmount(25400).runningBalance(84200)
                .remarks("Ticket Sales: AWS & Cloud DevOps Bootcamp").referenceId("TXN-RZP-9382-CIP")
                .status("SETTLED").timestamp(Instant.now().minus(7, ChronoUnit.DAYS)).build(),
            ClubLedgerEntry.builder()
                .clubId(cipher.getId()).clubName(cipher.getName()).type("PAYOUT_DISBURSEMENT")
                .creditAmount(0).debitAmount(15000).gatewayFee(0).netAmount(-15000).runningBalance(69200)
                .remarks("Dean Approved Payout: Cloud GPU Cluster & Refreshments").referenceId("DISB-ACEIT-2026-081")
                .status("SETTLED").timestamp(Instant.now().minus(3, ChronoUnit.DAYS)).build()
        );
        clubLedgerRepository.saveAll(entries);
    }

    private void seedUsers() {
        List<User> users = List.of(
            User.builder()
                .name("Govind Jangid")
                .email("govind@aryacollege.in")
                .role("STUDENT")
                .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250")
                .rollNo("22EACIT089")
                .department("Computer Science & Engineering")
                .semester(6)
                .batch(2026)
                .phone("+91 9829012345")
                .interests(List.of("Competitive Coding", "Hackathons", "Cloud & DevOps", "Esports"))
                .activityPointsTotal(45)
                .createdAt(Instant.now())
                .build(),
            User.builder()
                .name("Priya Verma")
                .email("cipher.admin@aryacollege.in")
                .role("CLUB_ADMIN")
                .avatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250")
                .administeredClubId("arya_cipher")
                .facultyDesignation("Student President - Arya Cipher Coding Club")
                .createdAt(Instant.now())
                .build(),
            User.builder()
                .name("Prof. (Dr.) Arun Arya")
                .email("dean@aryacollege.in")
                .role("SUPER_ADMIN")
                .avatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250")
                .facultyDesignation("Dean (Academics & Student Welfare) - Arya College")
                .createdAt(Instant.now())
                .build()
        );
        userRepository.saveAll(users);
    }

    private void seedEvents() {
        Venue audi = venueRepository.findByCode("AUDI_MAIN").orElse(null);
        Venue lab = venueRepository.findByCode("LAB_TURING").orElse(null);
        Venue lawn = venueRepository.findByCode("LAWN_CENTRAL").orElse(null);
        Club sihClub = clubRepository.findBySlug("arya_aceit_hack").orElse(null);
        Club danceClub = clubRepository.findBySlug("arya_dance").orElse(null);
        Club cipherClub = clubRepository.findBySlug("arya_cipher").orElse(null);
        Club roboticsClub = clubRepository.findBySlug("arya_robotics").orElse(null);
        Club automationClub = clubRepository.findBySlug("arya_automation").orElse(null);
        Club musicClub = clubRepository.findBySlug("arya_music").orElse(null);

        List<Event> officialEvents = new java.util.ArrayList<>();

        if (sihClub != null && audi != null) {
            officialEvents.add(Event.builder()
                .slug("smart-india-hackathon-2026")
                .title("Smart India Hackathon 2026 - ACEIT Internal Hackathon")
                .clubId(sihClub.getId())
                .clubName(sihClub.getName())
                .clubLogoUrl(sihClub.getLogoUrl())
                .category("Hackathons")
                .tags(List.of("SIH2026", "National", "Hardware", "Software", "ACEIT Innovation"))
                .shortSummary("Official Arya College Internal Hackathon for Smart India Hackathon (SIH) 2026 selections. Multidisciplinary teams solving hardware and software problem statements.")
                .descriptionMarkdown("# Smart India Hackathon 2026 - Arya Internal Rounds\nOfficial college screening hackathon to nominate the top ACEIT development teams for the National SIH 2026 Grand Finale.")
                .bannerImage("https://www.aryacollege.in/assets/photo/events/featured/events_featured_8491_1733288345.jpg")
                .venueId(audi.getId())
                .venueName(audi.getName())
                .startTime(Instant.now().plus(7, ChronoUnit.DAYS).truncatedTo(ChronoUnit.HOURS))
                .endTime(Instant.now().plus(8, ChronoUnit.DAYS).truncatedTo(ChronoUnit.HOURS))
                .registrationDeadline(Instant.now().plus(5, ChronoUnit.DAYS))
                .registrationType("TEAM")
                .minTeamSize(6)
                .maxTeamSize(6)
                .isPaid(false)
                .ticketPrice(0)
                .maxCapacity(300)
                .registeredCount(180)
                .waitlistCount(12)
                .activityPointsAwarded(30)
                .status("APPROVED")
                .approvedBy("Prof. (Dr.) Arun Arya (Dean Academics & Student Welfare)")
                .approvalComments("Official SIH institutional qualifier approved.")
                .approvedAt(Instant.now())
                .createdAt(Instant.now())
                .build());
        }

        if (danceClub != null && lawn != null) {
            officialEvents.add(Event.builder()
                .slug("arya-ratan-2026-the-freshers-party")
                .title("Arya Ratan 2026 - Annual Freshers Party & Cultural Fiesta")
                .clubId(danceClub.getId())
                .clubName(danceClub.getName())
                .clubLogoUrl(danceClub.getLogoUrl())
                .category("Cultural")
                .tags(List.of("AryaRatan", "Cultural", "Freshers2026", "DJNight", "DanceShowdown"))
                .shortSummary("The most glamorous cultural festival of Arya College! Featuring Mr. & Ms. Fresher, high-energy classical and western dance battles, celebrity DJ night, and star performances.")
                .descriptionMarkdown("# Arya Ratan 2026 - Freshers Welcome Fiesta\nAnnual cultural tradition of Arya College welcoming the incoming engineering batches.")
                .bannerImage("https://www.aryacollege.in/assets/photo/events/featured/events_featured_2837_1732595039.jpg")
                .venueId(lawn.getId())
                .venueName(lawn.getName())
                .startTime(Instant.now().minus(14, ChronoUnit.DAYS).truncatedTo(ChronoUnit.HOURS))
                .endTime(Instant.now().minus(14, ChronoUnit.DAYS).plus(7, ChronoUnit.HOURS))
                .registrationDeadline(Instant.now().minus(16, ChronoUnit.DAYS))
                .registrationType("SOLO")
                .minTeamSize(1)
                .maxTeamSize(1)
                .isPaid(false)
                .ticketPrice(0)
                .maxCapacity(1200)
                .registeredCount(840)
                .waitlistCount(0)
                .activityPointsAwarded(20)
                .status("COMPLETED")
                .approvedBy("Prof. (Dr.) Arun Arya (Dean Academics & Student Welfare)")
                .approvalComments("Grand Cultural Evening concluded successfully. 840 passes audited.")
                .approvedAt(Instant.now().minus(20, ChronoUnit.DAYS))
                .createdAt(Instant.now().minus(25, ChronoUnit.DAYS))
                .build());
        }

        if (cipherClub != null && lab != null) {
            officialEvents.add(Event.builder()
                .slug("codewars-24-hour-hackathon")
                .title("CodeWars 24-Hour Hackathon & Algorithmic Sprint")
                .clubId(cipherClub.getId())
                .clubName(cipherClub.getName())
                .clubLogoUrl(cipherClub.getLogoUrl())
                .category("Coding / Dev")
                .tags(List.of("CodeWars", "DSA", "CP", "WebDev", "CashPrize", "Incubation"))
                .shortSummary("High-intensity 24-hour coding sprint and algorithmic showdown hosted by Arya Cipher Coding Club. Top teams win direct interview fast-tracks and incubation grants.")
                .descriptionMarkdown("# CodeWars 2026 - Rules & Tracks\nSolve competitive algorithms, build rapid prototypes, and deploy functional MVPs within 24 continuous hours.")
                .bannerImage("https://www.aryacollege.in/assets/photo/events/featured/events_featured_4860_1725687091.jpg")
                .venueId(lab.getId())
                .venueName(lab.getName())
                .startTime(Instant.now().minus(28, ChronoUnit.DAYS).truncatedTo(ChronoUnit.HOURS))
                .endTime(Instant.now().minus(27, ChronoUnit.DAYS).truncatedTo(ChronoUnit.HOURS))
                .registrationDeadline(Instant.now().minus(30, ChronoUnit.DAYS))
                .registrationType("TEAM")
                .minTeamSize(2)
                .maxTeamSize(4)
                .isPaid(true)
                .ticketPrice(150.0)
                .maxCapacity(250)
                .registeredCount(192)
                .waitlistCount(24)
                .activityPointsAwarded(25)
                .status("COMPLETED")
                .approvedBy("Prof. (Dr.) Arun Arya (Dean Academics & Student Welfare)")
                .approvalComments("24-Hour Hackathon successfully concluded at Turing Lab.")
                .approvedAt(Instant.now().minus(35, ChronoUnit.DAYS))
                .createdAt(Instant.now().minus(40, ChronoUnit.DAYS))
                .build());
        }

        if (roboticsClub != null && lawn != null) {
            officialEvents.add(Event.builder()
                .slug("thar-national-tech-fest")
                .title("THAR 2026 - The National Tech Fest & Robotron Battle")
                .clubId(roboticsClub.getId())
                .clubName(roboticsClub.getName())
                .clubLogoUrl(roboticsClub.getLogoUrl())
                .category("Robotics")
                .tags(List.of("THAR2026", "RoboWars", "DroneRacing", "AIoT", "NationalFest"))
                .shortSummary("Arya College's national technical symposium: RoboWars, Drone Obstacle Racing, Line Follower, and AIoT Project Expos with participants from over 60 colleges.")
                .descriptionMarkdown("# THAR 2026 - National Technical Symposium\nCombat robotics arena, quadcopter aerial speedway, and smart IoT innovations.")
                .bannerImage("https://www.aryacollege.in/assets/photo/events/featured/events_featured_3352_1725687109.jpg")
                .venueId(lawn.getId())
                .venueName(lawn.getName())
                .startTime(Instant.now().plus(25, ChronoUnit.DAYS).truncatedTo(ChronoUnit.HOURS))
                .endTime(Instant.now().plus(27, ChronoUnit.DAYS).truncatedTo(ChronoUnit.HOURS))
                .registrationDeadline(Instant.now().plus(22, ChronoUnit.DAYS))
                .registrationType("TEAM")
                .minTeamSize(2)
                .maxTeamSize(5)
                .isPaid(true)
                .ticketPrice(200.0)
                .maxCapacity(500)
                .registeredCount(310)
                .waitlistCount(18)
                .activityPointsAwarded(25)
                .status("APPROVED")
                .approvedBy("Prof. (Dr.) Arun Arya (Dean Academics & Student Welfare)")
                .approvalComments("National Symposium logistics cleared.")
                .approvedAt(Instant.now())
                .createdAt(Instant.now())
                .build());
        }

        if (automationClub != null && lawn != null) {
            officialEvents.add(Event.builder()
                .slug("jaipur-street-karting-cup")
                .title("Jaipur Street Karting Cup & Autoignition Expo")
                .clubId(automationClub.getId())
                .clubName(automationClub.getName())
                .clubLogoUrl(automationClub.getLogoUrl())
                .category("Automobile & Tech")
                .tags(List.of("GoKart", "Automobile", "EV", "EngineTuning", "Motorsport"))
                .shortSummary("Formula student go-kart race, dyno tuning exhibits, and EV powertrain demonstration hosted by Arya Mechanical & Automation Society on the college track.")
                .descriptionMarkdown("# Jaipur Street Karting Cup 2026\nHigh octane kart racing and clean energy EV motor builds designed by Arya engineering students.")
                .bannerImage("https://www.aryacollege.in/assets/photo/events/featured/events_featured_6462_1725687123.jpg")
                .venueId(lawn.getId())
                .venueName("Arya Campus Outdoor Track & Grounds")
                .startTime(Instant.now().plus(30, ChronoUnit.DAYS).truncatedTo(ChronoUnit.HOURS))
                .endTime(Instant.now().plus(31, ChronoUnit.DAYS).truncatedTo(ChronoUnit.HOURS))
                .registrationDeadline(Instant.now().plus(26, ChronoUnit.DAYS))
                .registrationType("TEAM")
                .minTeamSize(3)
                .maxTeamSize(6)
                .isPaid(true)
                .ticketPrice(100.0)
                .maxCapacity(200)
                .registeredCount(145)
                .waitlistCount(8)
                .activityPointsAwarded(20)
                .status("APPROVED")
                .approvedBy("Prof. (Dr.) Arun Arya (Dean Academics & Student Welfare)")
                .approvalComments("Outdoor track safety protocols reviewed and cleared.")
                .approvedAt(Instant.now())
                .createdAt(Instant.now())
                .build());
        }

        if (musicClub != null && audi != null) {
            officialEvents.add(Event.builder()
                .slug("arya-euphonious-music-fest")
                .title("Arya Euphonious 2026 - Inter-College Rock Band Battle")
                .clubId(musicClub.getId())
                .clubName(musicClub.getName())
                .clubLogoUrl(musicClub.getLogoUrl())
                .category("Music")
                .tags(List.of("Euphonious", "BattleOfTheBands", "Acoustic", "LiveMusic", "AryaFest"))
                .shortSummary("The mega live music festival of Arya College! Electrifying guitar riffs, campus rock bands, sufi vocals, and acoustic duets under open campus skies.")
                .descriptionMarkdown("# Arya Euphonious 2026 - Musical Symphony\nAnnual battle of the bands featuring collegiate music societies and acoustic sensations.")
                .bannerImage("https://www.aryacollege.in/assets/photo/events/featured/events_featured_5298_1733307862.jpg")
                .venueId(audi.getId())
                .venueName(audi.getName())
                .startTime(Instant.now().plus(35, ChronoUnit.DAYS).truncatedTo(ChronoUnit.HOURS))
                .endTime(Instant.now().plus(35, ChronoUnit.DAYS).plus(6, ChronoUnit.HOURS))
                .registrationDeadline(Instant.now().plus(32, ChronoUnit.DAYS))
                .registrationType("SOLO")
                .minTeamSize(1)
                .maxTeamSize(8)
                .isPaid(false)
                .ticketPrice(0)
                .maxCapacity(750)
                .registeredCount(520)
                .waitlistCount(0)
                .activityPointsAwarded(15)
                .status("APPROVED")
                .approvedBy("Prof. (Dr.) Arun Arya (Dean Academics & Student Welfare)")
                .approvalComments("Auditorium sound system setup approved.")
                .approvedAt(Instant.now())
                .createdAt(Instant.now())
                .build());
        }

        eventRepository.saveAll(officialEvents);
    }

    private void seedRegistrations() {
        eventRepository.findAll().stream().filter(e -> "APPROVED".equals(e.getStatus())).findFirst().ifPresent(event -> {
            com.aryacollege.campussphere.model.Registration reg = com.aryacollege.campussphere.model.Registration.builder()
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .clubId(event.getClubId())
                .clubName(event.getClubName())
                .userId("student_priya_01")
                .userName("Priya Verma")
                .userEmail("priya.verma@aryacollege.in")
                .userRollNo("23EACEIT042")
                .department("Computer Science & Engineering")
                .semester(4)
                .registrationType("SOLO")
                .ticketNumber("CS-2026-HACK-8492")
                .hmacSecretSeed("arya_secret_seed_2026_priya")
                .ticketPrice(event.isPaid() ? event.getTicketPrice() : 0.0)
                .amountPaid(event.isPaid() ? event.getTicketPrice() : 0.0)
                .paymentId("pay_seed_razorpay_01")
                .paymentStatus(event.isPaid() ? "PAID" : "FREE")
                .attendanceVerified(false)
                .activityPointsAwarded(event.getActivityPointsAwarded())
                .createdAt(Instant.now())
                .build();
            registrationRepository.save(reg);
        });
    }

    private void seedFeedbacks() {
        eventRepository.findAll().stream().filter(e -> "APPROVED".equals(e.getStatus())).findFirst().ifPresent(event -> {
            VerifiedFeedback f1 = VerifiedFeedback.builder()
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .clubId(event.getClubId())
                .clubName(event.getClubName())
                .userId("student_priya_01")
                .userName("Priya Verma")
                .userRollNo("23EACEIT042")
                .department("Computer Science & Engineering")
                .contentDepth(5)
                .organization(5)
                .speakerQuality(4)
                .venueFacilities(4)
                .valueForTime(5)
                .averageRating(4.6)
                .reviewText("Outstanding hackathon organization! The mentorship rounds and high-speed LAN connectivity in Turing Lab were remarkable.")
                .sentiment("POSITIVE")
                .anonymous(false)
                .createdAt(Instant.now().minus(2, ChronoUnit.HOURS))
                .build();
            feedbackRepository.save(f1);
        });
    }

    private void seedSuggestions() {
        eventRepository.findAll().stream().filter(e -> "APPROVED".equals(e.getStatus())).findFirst().ifPresent(event -> {
            StudentSuggestion s1 = StudentSuggestion.builder()
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .clubId(event.getClubId())
                .clubName(event.getClubName())
                .authorUserId("user_student_1")
                .authorName("Govind Jangid")
                .authorRollNo("22EACIT089")
                .title("Install 2 Additional High-Capacity 5GHz APs in Block B Lab")
                .description("During concurrent testing of full-stack AI models, local Wi-Fi ping spiked. Dedicated Cisco 1Gbps switches will ensure smooth deployment.")
                .upvotesCount(14)
                .upvotedByUserIds(List.of("user_student_1", "student_priya_01", "student_user_12"))
                .kanbanStatus("IMPLEMENTED")
                .respondedByAdminId("user_club_admin_1")
                .respondedByAdminName("Priya Verma")
                .clubActionResponseText("Coordinated with Arya College Network Administration Cell. 2 dedicated Cisco Gigabit Access Points installed and load-balanced!")
                .resolvedAt(Instant.now().minus(1, ChronoUnit.DAYS))
                .createdAt(Instant.now().minus(3, ChronoUnit.DAYS))
                .build();

            StudentSuggestion s2 = StudentSuggestion.builder()
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .clubId(event.getClubId())
                .clubName(event.getClubName())
                .authorUserId("student_priya_01")
                .authorName("Priya Verma")
                .authorRollNo("23EACEIT042")
                .title("Provide 24/7 Red Bull / Coffee Station for Overnight Sprints")
                .description("Late night problem solving between 2 AM and 5 AM requires energy drinks and hot refreshments near the cafeteria foyer.")
                .upvotesCount(28)
                .upvotedByUserIds(List.of("student_priya_01", "user_student_1"))
                .kanbanStatus("PLANNED")
                .respondedByAdminId("user_club_admin_1")
                .respondedByAdminName("Priya Verma")
                .clubActionResponseText("Approved by Faculty In-Charge Dr. Mittal. Hot beverage vending machine reserved for next hackathon.")
                .createdAt(Instant.now().minus(2, ChronoUnit.DAYS))
                .build();

            suggestionRepository.saveAll(List.of(s1, s2));
        });
    }

    private void seedCertificates() {
        eventRepository.findAll().stream().filter(e -> "APPROVED".equals(e.getStatus())).findFirst().ifPresent(event -> {
            Certificate c = Certificate.builder()
                .certificateId("CS-ARYA-2026-HACK-0142")
                .verificationHash("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .eventCategory("Hackathons")
                .clubId(event.getClubId())
                .organizingClub(event.getClubName())
                .userId("user_student_1")
                .studentName("Govind Jangid")
                .rollNo("22EACIT089")
                .department("Computer Science & Engineering")
                .semester(6)
                .activityPointsAwarded(25)
                .deanSignatory("Dr. R. K. Sharma (Dean Academics & Student Welfare)")
                .institution("Arya College of Engineering & IT (ACEIT), Jaipur")
                .publicVerifyUrl("https://campussphere.aryacollege.in/verify/CS-ARYA-2026-HACK-0142")
                .issuedAt(Instant.now().minus(5, ChronoUnit.DAYS))
                .build();
            certificateRepository.save(c);
        });
    }
}

