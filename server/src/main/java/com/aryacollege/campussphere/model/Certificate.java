package com.aryacollege.campussphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "certificates")
public class Certificate {

    @Id
    private String id;

    // Cryptographic Serial Identifier (e.g. CS-ARYA-2026-HACK-8492)
    private String certificateId;

    // SHA-256 Tamper-Proof Cryptographic Verification Seal
    private String verificationHash;

    private String eventId;
    private String eventTitle;
    private String eventCategory;

    private String clubId;
    private String organizingClub;

    // Student Recipient Identity
    private String userId;
    private String studentName;
    private String rollNo;
    private String department;
    private int semester;

    // AICTE Activity Credits
    private int activityPointsAwarded;

    // Institutional Authority Signatures
    @Builder.Default
    private String deanSignatory = "Dr. R. K. Sharma (Dean Academics & Student Welfare)";
    @Builder.Default
    private String institution = "Arya College of Engineering & IT (ACEIT), Jaipur";

    private String publicVerifyUrl;

    @Builder.Default
    private Instant issuedAt = Instant.now();
}
