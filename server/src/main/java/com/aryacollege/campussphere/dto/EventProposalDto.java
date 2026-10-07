package com.aryacollege.campussphere.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventProposalDto {

    @NotBlank(message = "Event title is required")
    private String title;

    @NotBlank(message = "Club ID is required")
    private String clubId;

    @NotBlank(message = "Category is required")
    private String category;

    private List<String> tags;

    @NotBlank(message = "Short summary is required")
    private String shortSummary;

    private String descriptionMarkdown;
    private String bannerImage;

    @NotBlank(message = "Venue ID is required")
    private String venueId;

    @NotNull(message = "Start time is required")
    private Instant startTime;

    @NotNull(message = "End time is required")
    private Instant endTime;

    private Instant registrationDeadline;

    @Builder.Default
    private String registrationType = "SOLO"; // "SOLO" | "TEAM"

    @Builder.Default
    private int minTeamSize = 2;

    @Builder.Default
    private int maxTeamSize = 4;

    private boolean isPaid;
    private double ticketPrice;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int maxCapacity;

    @Min(value = 0, message = "AICTE Activity points cannot be negative")
    private int activityPointsAwarded;
}
