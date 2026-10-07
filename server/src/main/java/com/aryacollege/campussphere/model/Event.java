package com.aryacollege.campussphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "events")
public class Event {

    @Id
    private String id;

    @Indexed(unique = true)
    private String slug;

    private String title;
    private String clubId;
    private String clubName;
    private String clubLogoUrl;
    private String category;
    private List<String> tags;
    private String shortSummary;
    private String descriptionMarkdown;
    private String bannerImage;

    private String venueId;
    private String venueName;

    private Instant startTime;
    private Instant endTime;
    private Instant registrationDeadline;

    private String registrationType; // "SOLO" | "TEAM"
    private int minTeamSize;
    private int maxTeamSize;

    private boolean isPaid;
    private double ticketPrice;
    private int maxCapacity;
    private int registeredCount;
    private int waitlistCount;

    private int activityPointsAwarded; // AICTE Activity Points

    @Indexed
    private String status; // "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "LIVE" | "COMPLETED" | "CANCELLED"

    private String approvedBy;
    private String approvalComments;
    private Instant approvedAt;

    private Instant createdAt;
}
