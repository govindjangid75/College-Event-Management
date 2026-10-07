package com.aryacollege.campussphere.dto;

import com.aryacollege.campussphere.model.Venue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VenueClashResultDto {

    private boolean isClash;
    private String conflictingEventId;
    private String conflictingEventTitle;
    private String conflictingClubName;
    private String conflictingSchedule;
    private String bufferExplanation;
    private List<Venue> alternativeVenues;
}
