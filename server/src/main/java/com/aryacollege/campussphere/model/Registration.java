package com.aryacollege.campussphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "registrations")
public class Registration {

    @Id
    private String id;

    private String eventId;
    private String eventTitle;
    private String clubId;
    private String clubName;

    // Student identity
    private String userId;
    private String userName;
    private String userEmail;
    private String userRollNo;
    private String department;
    private int semester;

    // Registration Mode
    @Builder.Default
    private String registrationType = "SOLO"; // "SOLO" | "TEAM"

    private String teamName;
    private String teamPasscode;
    
    @Builder.Default
    private List<String> teamMembers = new ArrayList<>();

    // Dynamic Anti-Screenshot Ticket Details
    private String ticketNumber;
    private String hmacSecretSeed;

    // Payment details
    private double ticketPrice;
    private double amountPaid;
    private String paymentId;
    private String paymentStatus; // "FREE" | "PAID"

    // Gate Verification
    @Builder.Default
    private boolean attendanceVerified = false;
    private Instant checkedInAt;
    private String scannedByAdminId;

    @Builder.Default
    private boolean feedbackSubmitted = false;

    @Builder.Default
    private boolean certificateClaimed = false;

    private int activityPointsAwarded;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
