package com.aryacollege.campussphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiEventDraftDto {
    private String prompt;
    private String clubId;
    private String category;

    // Generated fields
    private String suggestedTitle;
    private String shortSummary;
    private String descriptionMarkdown;
    private String suggestedCategory;
    private List<String> tags;
    private int suggestedPoints;
    private String idealVenueName;
    private int recommendedCapacity;
    private String agendaMarkdown;
}
