package com.aryacollege.campussphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "student_suggestions")
public class StudentSuggestion {

    @Id
    private String id;

    private String eventId;
    private String eventTitle;
    private String clubId;
    private String clubName;

    private String authorUserId;
    private String authorName;
    private String authorRollNo;

    private String title;
    private String description;

    @Builder.Default
    private int upvotesCount = 1;

    @Builder.Default
    private List<String> upvotedByUserIds = new ArrayList<>();

    // "You Said, We Did" Kanban Workflow
    // SUBMITTED -> UNDER_REVIEW -> PLANNED -> IMPLEMENTED
    @Builder.Default
    private String kanbanStatus = "SUBMITTED";

    // Club Response & Action Proof
    private String respondedByAdminId;
    private String respondedByAdminName;
    private String clubActionResponseText;
    private String proofImageUrl;
    private Instant resolvedAt;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
