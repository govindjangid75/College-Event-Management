package com.aryacollege.campussphere.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackSubmissionDto {

    @NotBlank(message = "eventId is required")
    private String eventId;

    @NotBlank(message = "userId is required")
    private String userId;

    @Min(1) @Max(5)
    private int contentDepth;

    @Min(1) @Max(5)
    private int organization;

    @Min(1) @Max(5)
    private int speakerQuality;

    @Min(1) @Max(5)
    private int venueFacilities;

    @Min(1) @Max(5)
    private int valueForTime;

    private String reviewText;

    private boolean anonymous;
}
