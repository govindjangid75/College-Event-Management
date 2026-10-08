package com.aryacollege.campussphere.service;

import com.aryacollege.campussphere.dto.AicteTranscriptDto;
import com.aryacollege.campussphere.model.Certificate;
import com.aryacollege.campussphere.model.Event;
import com.aryacollege.campussphere.model.Registration;
import com.aryacollege.campussphere.model.User;
import com.aryacollege.campussphere.repository.CertificateRepository;
import com.aryacollege.campussphere.repository.EventRepository;
import com.aryacollege.campussphere.repository.RegistrationRepository;
import com.aryacollege.campussphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    /**
     * Issue Cryptographically Sealed E-Certificate.
     * Enforces attendance verification at the entrance gate!
     */
    public Certificate claimOrGenerateCertificate(String eventId, String userId) {
        // 1. Check if certificate is already generated
        Optional<Certificate> existingCert = certificateRepository.findByEventIdAndUserId(eventId, userId);
        if (existingCert.isPresent()) {
            return existingCert.get();
        }

        // 2. Fetch Registration
        Registration reg = registrationRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Registration record not found for student on this event."));

        // 3. Attendance Gatekeeping Check
        if (!reg.isAttendanceVerified()) {
            throw new IllegalStateException("Certificate Locked: Verified gate admission required to claim official credential.");
        }

        // 4. Fetch Event
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found with ID: " + eventId));

        // 5. Generate Cryptographic Serial and SHA-256 Seal
        String eventShort = event.getTitle().replaceAll("[^A-Za-z0-9]", "").toUpperCase();
        if (eventShort.length() > 6) eventShort = eventShort.substring(0, 6);
        String randomSuffix = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        String certSerial = "CS-ARYA-2026-" + eventShort + "-" + randomSuffix;

        String rawDigestData = certSerial + ":" + userId + ":" + eventId + ":ARYA_INSTITUTIONAL_KEY_2026";
        String sha256Hex = computeSha256(rawDigestData);

        int activityPts = event.getActivityPointsAwarded() > 0 ? event.getActivityPointsAwarded() : 15;

        Certificate cert = Certificate.builder()
                .certificateId(certSerial)
                .verificationHash(sha256Hex)
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .eventCategory(event.getCategory() != null ? event.getCategory() : "Technical")
                .clubId(event.getClubId())
                .organizingClub(event.getClubName())
                .userId(userId)
                .studentName(reg.getUserName())
                .rollNo(reg.getUserRollNo() != null ? reg.getUserRollNo() : "22EACIT089")
                .department(reg.getDepartment() != null ? reg.getDepartment() : "Computer Science & Engineering")
                .semester(reg.getSemester() > 0 ? reg.getSemester() : 6)
                .activityPointsAwarded(activityPts)
                .deanSignatory("Dr. R. K. Sharma (Dean Academics & Student Welfare)")
                .institution("Arya College of Engineering & IT (ACEIT), Jaipur")
                .publicVerifyUrl("https://campussphere.aryacollege.in/verify/" + certSerial)
                .issuedAt(Instant.now())
                .build();

        Certificate saved = certificateRepository.save(cert);

        // 6. Update Registration status
        reg.setCertificateClaimed(true);
        registrationRepository.save(reg);

        // 7. Update User Profile total activity points if user exists
        userRepository.findById(userId).ifPresent(user -> {
            user.setActivityPointsTotal(user.getActivityPointsTotal() + activityPts);
            userRepository.save(user);
        });

        return saved;
    }

    public List<Certificate> getUserCertificates(String userId) {
        return certificateRepository.findByUserIdOrderByIssuedAtDesc(userId);
    }

    public List<Certificate> getEventCertificates(String eventId) {
        return certificateRepository.findByEventIdOrderByIssuedAtDesc(eventId);
    }

    /**
     * Public Certificate Verification without Authentication.
     */
    public Certificate verifyCertificatePublic(String certificateId) {
        return certificateRepository.findByCertificateId(certificateId)
                .orElseThrow(() -> new IllegalArgumentException("No authentic Arya College certificate found with Serial ID: " + certificateId));
    }

    /**
     * Official AICTE / RTU Activity Points Transcript Generation.
     */
    public AicteTranscriptDto getUserAicteTranscript(String userId) {
        return getUserAicteTranscript(userId, null, null, null, null, null);
    }

    public AicteTranscriptDto getUserAicteTranscript(String userId, String studentName, String rollNo, String department, Integer semester, Integer batchParam) {
        List<Certificate> certs = certificateRepository.findByUserIdOrderByIssuedAtDesc(userId);

        Optional<User> userOpt = userRepository.findById(userId);
        String name = (studentName != null && !studentName.isBlank()) ? studentName
                : userOpt.map(User::getName).orElseGet(() -> !certs.isEmpty() && certs.get(0).getStudentName() != null ? certs.get(0).getStudentName() : "Student");

        String roll = (rollNo != null && !rollNo.isBlank()) ? rollNo
                : userOpt.map(User::getRollNo).filter(r -> !r.isBlank()).orElseGet(() -> !certs.isEmpty() && certs.get(0).getRollNo() != null ? certs.get(0).getRollNo() : "N/A");

        String dept = (department != null && !department.isBlank()) ? department
                : userOpt.map(User::getDepartment).filter(d -> !d.isBlank()).orElseGet(() -> !certs.isEmpty() && certs.get(0).getDepartment() != null ? certs.get(0).getDepartment() : "Computer Science & Engineering");

        int sem = (semester != null && semester > 0) ? semester
                : userOpt.map(User::getSemester).filter(s -> s > 0).orElseGet(() -> !certs.isEmpty() && certs.get(0).getSemester() > 0 ? certs.get(0).getSemester() : 4);

        int batch = (batchParam != null && batchParam > 0) ? batchParam
                : userOpt.map(User::getBatch).filter(b -> b > 0).orElse(2026);

        int totalPts = 0;
        Map<String, Integer> categoryMap = new HashMap<>();

        for (Certificate c : certs) {
            int pts = c.getActivityPointsAwarded();
            totalPts += pts;
            String cat = c.getEventCategory() != null ? c.getEventCategory() : "Technical";
            categoryMap.put(cat, categoryMap.getOrDefault(cat, 0) + pts);
        }

        // Only include pre-existing base points if the user explicitly has points in MongoDB
        if (totalPts == 0 && userOpt.isPresent()) {
            int dbPts = userOpt.get().getActivityPointsTotal();
            if (dbPts > 0) {
                totalPts = dbPts;
                categoryMap.put("Technical & Innovation", dbPts);
            }
        }

        boolean honors = totalPts >= 100;
        double pct = Math.min(100.0, Math.round(((double) totalPts / 100.0) * 1000.0) / 10.0);

        return AicteTranscriptDto.builder()
                .userId(userId)
                .studentName(name)
                .rollNo(roll)
                .department(dept)
                .semester(sem)
                .batch(batch)
                .totalActivityPointsEarned(totalPts)
                .requiredHonorsPoints(100)
                .honorsEligible(honors)
                .completionPercentage(pct)
                .categoryPointsBreakdown(categoryMap)
                .earnedCertificates(certs)
                .certifiedBy("Dr. R. K. Sharma (Dean Academics & RTU Compliance Coordinator)")
                .generatedAt(Instant.now())
                .build();
    }

    private String computeSha256(String base) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(base.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception ex) {
            return UUID.randomUUID().toString().replace("-", "");
        }
    }
}
