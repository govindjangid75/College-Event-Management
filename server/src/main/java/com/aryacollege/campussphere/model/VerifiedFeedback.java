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
@Document(collection = "verified_feedbacks")
public class VerifiedFeedback {

    @Id
    private String id;

    private String eventId;
    private String eventTitle;
    private String clubId;
    private String clubName;

    // Student identity (Verified Attendee)
    private String userId;
    private String userName;
    private String userRollNo;
    private String department;

    // 5-Dimension Evaluation Vectors (1 - 5 Stars)
    private int contentDepth;       // Content & Knowledge Depth
    private int organization;       // Event Coordination & Timing
    private int speakerQuality;     // Speaker / Instructor Quality
    private int venueFacilities;    // Venue & Audio-Visual Setup
    private int valueForTime;       // Overall Value for Time

    private double averageRating;   // Computed mean score

    private String reviewText;
    
    @Builder.Default
    private String sentiment = "POSITIVE"; // POSITIVE | NEUTRAL | NEGATIVE

    @Builder.Default
    private boolean anonymous = false;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
