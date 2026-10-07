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
public class KanbanStatusUpdateDto {

    @NotBlank(message = "suggestionId is required")
    private String suggestionId;

    // SUBMITTED | UNDER_REVIEW | PLANNED | IMPLEMENTED
    @NotBlank(message = "newStatus is required")
    private String newStatus;

    private String adminId;
    private String adminName;
    private String responseText;
    private String proofImageUrl;
}
