package com.aryacollege.campussphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "club_applications")
public class ClubApplication {

    @Id
    private String id;

    @Indexed
    private String clubId;
    private String clubName;

    private String userId;
    private String userName;
    private String userEmail;
    private String userRollNo;
    private String department;
    private int semester;
    private String statementOfPurpose;
    private String preferredRole;
    private String status; // "PENDING" | "ACCEPTED" | "REJECTED"
    private Instant appliedAt;
    private Instant reviewedAt;
    private String reviewerNotes;
}
