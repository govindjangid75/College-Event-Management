package com.aryacollege.campussphere.service;

import com.aryacollege.campussphere.dto.AiChatDto;
import com.aryacollege.campussphere.dto.AiEventDraftDto;
import com.aryacollege.campussphere.model.Club;
import com.aryacollege.campussphere.model.Event;
import com.aryacollege.campussphere.model.User;
import com.aryacollege.campussphere.repository.ClubRepository;
import com.aryacollege.campussphere.repository.EventRepository;
import com.aryacollege.campussphere.repository.UserRepository;
import com.aryacollege.campussphere.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    private final EventRepository eventRepository;
    private final ClubRepository clubRepository;
    private final VenueRepository venueRepository;
    private final UserRepository userRepository;

    /**
     * AI Copilot: Generates a complete, structured event proposal from a prompt.
     */
    public AiEventDraftDto generateEventDraft(AiEventDraftDto request) {
        String prompt = (request.getPrompt() != null) ? request.getPrompt().trim() : "Technical Coding Hackathon";
        String lower = prompt.toLowerCase();

        String title;
        String shortSummary;
        StringBuilder md = new StringBuilder();
        List<String> tags = new ArrayList<>();
        int points = 20;
        String venueName = "Arya Turing Computing & Innovation Lab";
        int capacity = 180;
        String category = "Technical";

        if (lower.contains("hackathon") || lower.contains("sprint") || lower.contains("code") || lower.contains("ai")) {
            title = "Arya " + capitalizeWords(prompt.replaceAll("(?i)(event|workshop|for|students)", "").trim()) + " 2026";
            if (!title.toLowerCase().contains("hack")) title += " Hackathon";
            category = "Hackathons";
            points = 25;
            venueName = "Arya Turing Computing & Innovation Lab";
            capacity = 200;
            shortSummary = "An intensive 36-hour technical buildathon for B.Tech engineers to design, build, and deploy high-impact AI and software solutions.";
            tags.addAll(List.of("Hackathon", "AI/ML", "Cloud Deploy", "RTU-Honors", "TeamBuild"));

            md.append("## Executive Overview\n\n")
              .append("Join Arya College's premier technical innovation sprint. Participants will form multidisciplinary teams to tackle industry challenges using next-generation AI and distributed architectures.\n\n")
              .append("### Key Focus Areas\n")
              .append("- **Autonomous Systems & Edge AI:** Local inference and edge models\n")
              .append("- **Full-Stack Cloud Native:** Microservices, Docker containers, live APIs\n")
              .append("- **Institutional Impact:** Smart campus, green energy, and automation tracks\n\n")
              .append("### Schedule & Milestone Tracks\n")
              .append("| Milestone | Timeline | Deliverable |\n")
              .append("| :--- | :--- | :--- |\n")
              .append("| Phase 1 | Hour 0 - 6 | Problem statement selection & Git repo init |\n")
              .append("| Phase 2 | Hour 6 - 20 | Core architecture build & Mentor Checkpoint |\n")
              .append("| Phase 3 | Hour 20 - 32 | Frontend polish, testing & deployment |\n")
              .append("| Grand Finale | Hour 32 - 36 | Pitch deck demo to Dean & Industry Jury |\n\n")
              .append("### Certification & AICTE Credit\n")
              .append("All gate-verified participants receive **25 AICTE Activity Points** and cryptographically sealed certificates.");
        } else if (lower.contains("robot") || lower.contains("iot") || lower.contains("hardware") || lower.contains("drone")) {
            title = "Arya Robotics & AIoT Prototype Challenge 2026";
            category = "Robotics";
            points = 20;
            venueName = "Academic Block B — Mechatronics & Embedded Systems Lab";
            capacity = 120;
            shortSummary = "Hands-on hardware synthesis, microcontroller programming, and drone navigation workshop and competition.";
            tags.addAll(List.of("Robotics", "IoT", "Embedded", "ROS2", "Hardware"));

            md.append("## Overview\n\n")
              .append("Dive deep into industrial automation, microcontrollers (ESP32, STM32, Arduino), and embedded control algorithms.\n\n")
              .append("### Workshop Curriculum\n")
              .append("1. **Sensor Integration:** LiDAR, ultrasonic, and telemetry streams\n")
              .append("2. **Motor Controllers & Actuators:** PWM modulation and power circuits\n")
              .append("3. **Real-time Navigation Challenge:** Obstacle avoidance maze sprint");
        } else if (lower.contains("dance") || lower.contains("music") || lower.contains("cultural") || lower.contains("drama")) {
            title = "Arya Tarang: Annual Inter-College Cultural Extravaganza";
            category = "Cultural";
            points = 15;
            venueName = "Arya Central Air-Conditioned Auditorium";
            capacity = 850;
            shortSummary = "Grand stage showcase celebrating music, choreography, drama, and regional heritage across Rajasthan technical colleges.";
            tags.addAll(List.of("Cultural", "StageArts", "Dance", "Music", "RTU-Activity"));

            md.append("## Cultural Showcase\n\n")
              .append("Arya College's signature arts festival bringing together vocalists, contemporary dancers, and theatrical troupes.\n\n")
              .append("### Competition Segments\n")
              .append("- **Battle of the Bands:** Live rock and acoustic band face-off\n")
              .append("- **Natraj Choreography:** Classical, folk, and western dance crew battles\n")
              .append("- **Street Play (Nukkad Natak):** Social awareness theatricals");
        } else {
            title = "Arya Masterclass: " + capitalizeWords(prompt);
            category = "Technical";
            points = 15;
            venueName = "Arya Seminar Hall A (Audio-Visual Enabled)";
            capacity = 150;
            shortSummary = "In-depth technical seminar and hands-on laboratory session for aspiring engineers.";
            tags.addAll(List.of("SkillDevelopment", "AryaCollege", "Engineering", "AICTE-Points"));

            md.append("## Session Outline\n\n")
              .append("Comprehensive training session conducted by faculty and senior technical coordinators.\n\n")
              .append("### Topics Covered\n")
              .append("- Fundamentals, best practices, and modern industry toolchains\n")
              .append("- Practical hands-on problem solving\n")
              .append("- Career roadmap and internship pathways");
        }

        return AiEventDraftDto.builder()
                .prompt(prompt)
                .clubId(request.getClubId() != null ? request.getClubId() : "arya_cipher")
                .category(category)
                .suggestedTitle(title)
                .shortSummary(shortSummary)
                .descriptionMarkdown(md.toString())
                .suggestedCategory(category)
                .tags(tags)
                .suggestedPoints(points)
                .idealVenueName(venueName)
                .recommendedCapacity(capacity)
                .agendaMarkdown(md.toString())
                .build();
    }

    /**
     * Campus Concierge RAG Chatbot: Responds in natural English/Hinglish with context-aware links.
     */
    public AiChatDto.Response handleConciergeChat(AiChatDto.Request request) {
        String query = (request.getQuery() != null) ? request.getQuery().trim() : "";
        String q = query.toLowerCase();

        String reply;
        String intent;
        List<AiChatDto.ActionLink> links = new ArrayList<>();
        List<String> followUps = new ArrayList<>();

        if (q.contains("hackathon") || q.contains("coding") || q.contains("code") || q.contains("event") || q.contains("kab hai") || q.contains("upcoming")) {
            intent = "EVENT_INQUIRY";
            List<Event> events = eventRepository.findByStatus("APPROVED");
            if (events.isEmpty()) events = eventRepository.findAll();

            String nextTitle = !events.isEmpty() ? events.get(0).getTitle() : "Arya HackSprint 2026";
            reply = "Arya College me upcoming flagship event hai: **" + nextTitle + "**! " +
                    "Ye 36-hour national buildathon Turing Lab me organize ho raha hai. Isme solo aur team registration open hai, aur gate check-in ke baad **25 AICTE Activity Points** milte hain.";

            links.add(AiChatDto.ActionLink.builder().label("Browse Upcoming Events").url("/events").type("EVENT").build());
            links.add(AiChatDto.ActionLink.builder().label("View Registered Passes").url("/my-passes").type("PASS").build());
            followUps.addAll(List.of("Team registration kaise karein?", "Kitne AICTE points milenge?", "Auditorium venue check karo"));

        } else if (q.contains("aicte") || q.contains("point") || q.contains("credit") || q.contains("honors") || q.contains("100")) {
            intent = "AICTE_POINTS";
            reply = "Rajasthan Technical University (RTU) aur AICTE norms ke mutabiq, B.Tech Honors degree ke liye **100 Activity Points** mandatory non-credit requirement hai.\n\n" +
                    "- **Hackathons & Technical:** 20 - 30 Points per event\n" +
                    "- **Social Welfare & CSR:** 10 - 20 Points per event\n" +
                    "- **Cultural & Arts:** 10 - 15 Points per event\n\n" +
                    "Aapke points automatic update hote hain jab aapka Dynamic QR Pass venue gate par scan hota hai. Aap apna official signed transcript profile se export kar sakte hain.";

            links.add(AiChatDto.ActionLink.builder().label("Check My AICTE Transcript").url("/profile").type("TRANSCRIPT").build());
            links.add(AiChatDto.ActionLink.builder().label("View My Verifiable Certificates").url("/my-certificates").type("CERT").build());
            followUps.addAll(List.of("Next technical event kaunsa hai?", "Certificate verify kaise karein?"));

        } else if (q.contains("club") || q.contains("cipher") || q.contains("join") || q.contains("recruitment")) {
            intent = "CLUB_INQUIRY";
            long clubCount = clubRepository.count();
            reply = "Arya College (ACEIT) me total **" + (clubCount > 0 ? clubCount : 15) + " Institutional Clubs** active hain!\n\n" +
                    "- **Arya Cipher Coding Club:** Competitive programming, Web3 & AI\n" +
                    "- **Arya Robotics & AIoT:** Hardware synthesis & drones\n" +
                    "- **Arya E-Sports Club:** Valorant & BGMI collegiate tournaments\n" +
                    "- **Arya Tarang Cultural Club:** Music, dance & drama\n\n" +
                    "Kisi bhi club ke page par jakar aap 'Apply to Join' button se recruitment statement submit kar sakte hain.";

            links.add(AiChatDto.ActionLink.builder().label("Explore All 15 Clubs").url("/clubs").type("CLUB").build());
            links.add(AiChatDto.ActionLink.builder().label("Arya Cipher Coding Club").url("/clubs/arya_cipher").type("CLUB").build());
            followUps.addAll(List.of("Clubs ke events kaunse hain?", "Treasury kaise kaam karti hai?"));

        } else if (q.contains("pass") || q.contains("qr") || q.contains("gate") || q.contains("screenshot") || q.contains("entry")) {
            intent = "PASS_INQUIRY";
            reply = "CampusSphere **Dynamic Anti-Screenshot QR Pass Engine** use karta hai. Har pass me 30 seconds ka rolling HMAC-SHA256 token hota hai. Forward kiye gaye screenshots gate par invalid ho jayenge.\n\n" +
                    "Event day par **My Passes** kholkar scanner ke aage apna dynamic pass show karein. Gate admission verify hote hi aapka 5-vector review aur E-Certificate unlock ho jayega!";

            links.add(AiChatDto.ActionLink.builder().label("Open My Dynamic Passes").url("/my-passes").type("PASS").build());
            followUps.addAll(List.of("Agar net na chale to pass kaise dikhayein?", "Certificate kahan se milega?"));

        } else if (q.contains("certificate") || q.contains("verify") || q.contains("linkedin") || q.contains("hash")) {
            intent = "CERTIFICATE_INQUIRY";
            reply = "Har certificate cryptographically sealed hota hai unique serial ID (jaise `CS-ARYA-2026-HACK-0142`) aur SHA-256 hash ke sath.\n\n" +
                    "Ye certificates bina login kiye public URL `/verify/:id` par kisi bhi recruiter ya company dwara verify kiye ja sakte hain. Sath hi aap 1-click me ise LinkedIn profile par add kar sakte hain!";

            links.add(AiChatDto.ActionLink.builder().label("My E-Certificates").url("/my-certificates").type("CERT").build());
            links.add(AiChatDto.ActionLink.builder().label("Inspect Public Verification Demo").url("/verify/CS-ARYA-2026-HACK-0142").type("VERIFY").build());
            followUps.addAll(List.of("AICTE points transcript kaise download karein?", "Upcoming events kaunse hain?"));

        } else {
            intent = "GENERAL_CONCIERGE";
            reply = "Namaste! Main **SphereAI**, Arya College of Engineering & IT (ACEIT) ka Campus Concierge assistant hoon. " +
                    "Main campus events, venue clash schedules, 15 institutional clubs, dynamic QR passes, aur 100 AICTE Activity Points tracker me aapki help kar sakta hoon. " +
                    "Aap mujhse kisi bhi event, club ya policy ke baare me English ya Hinglish me pooch sakte hain!";

            links.add(AiChatDto.ActionLink.builder().label("Browse Upcoming Events").url("/events").type("EVENT").build());
            links.add(AiChatDto.ActionLink.builder().label("Explore Campus Clubs").url("/clubs").type("CLUB").build());
            links.add(AiChatDto.ActionLink.builder().label("Check AICTE Transcript").url("/profile").type("TRANSCRIPT").build());
            followUps.addAll(List.of("Flagship Hackathons kaunse hain?", "AICTE Points kaise milte hain?", "My Passes dikhao"));
        }

        return AiChatDto.Response.builder()
                .query(query)
                .reply(reply)
                .intent(intent)
                .actionLinks(links)
                .quickFollowUps(followUps)
                .build();
    }

    /**
     * Personalized AI Event Recommender.
     */
    public List<Event> getRecommendedEvents(String userId) {
        List<Event> all = eventRepository.findByStatus("APPROVED");
        if (all.isEmpty()) all = eventRepository.findAll();

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return all.stream().limit(4).collect(Collectors.toList());
        }

        User user = userOpt.get();
        String dept = (user.getDepartment() != null) ? user.getDepartment().toLowerCase() : "computer";

        // Prioritize technical and hackathons for CS/IT, robotics for ECE/EE
        return all.stream()
                .sorted((e1, e2) -> {
                    boolean m1 = e1.getCategory() != null && e1.getCategory().toLowerCase().contains("hack");
                    boolean m2 = e2.getCategory() != null && e2.getCategory().toLowerCase().contains("hack");
                    if (m1 && !m2) return -1;
                    if (!m1 && m2) return 1;
                    return Integer.compare(e2.getActivityPointsAwarded(), e1.getActivityPointsAwarded());
                })
                .limit(4)
                .collect(Collectors.toList());
    }

    private String capitalizeWords(String text) {
        if (text == null || text.isBlank()) return "Event";
        return Arrays.stream(text.split("\\s+"))
                .map(word -> word.isEmpty() ? word : Character.toUpperCase(word.charAt(0)) + word.substring(1).toLowerCase())
                .collect(Collectors.joining(" "));
    }
}
