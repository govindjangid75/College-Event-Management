package com.aryacollege.campussphere.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VenueClashCheckDto {

    @NotBlank(message = "venueId is required")
    private String venueId;

    @NotNull(message = "startTime is required")
    private Instant startTime;

    @NotNull(message = "endTime is required")
    private Instant endTime;

    private String excludeEventId;
}
