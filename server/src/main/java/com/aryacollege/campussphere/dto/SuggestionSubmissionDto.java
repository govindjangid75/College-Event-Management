package com.aryacollege.campussphere.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuggestionSubmissionDto {

    @NotBlank(message = "eventId is required")
    private String eventId;

    @NotBlank(message = "userId is required")
    private String userId;

    @NotBlank(message = "title is required")
    private String title;

    @NotBlank(message = "description is required")
    private String description;
}
