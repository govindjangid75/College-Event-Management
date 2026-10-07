package com.aryacollege.campussphere.dto;

import com.aryacollege.campussphere.model.VerifiedFeedback;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventFeedbackSummaryDto {

    private String eventId;
    private String eventTitle;
    private int totalReviews;

    // Averages across 5 vectors
    private double averageOverallRating;
    private double averageContentDepth;
    private double averageOrganization;
    private double averageSpeakerQuality;
    private double averageVenueFacilities;
    private double averageValueForTime;

    private List<VerifiedFeedback> reviews;
}
