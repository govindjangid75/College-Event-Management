package com.aryacollege.campussphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String role; // "STUDENT" | "CLUB_ADMIN" | "SUPER_ADMIN"
    private String avatarUrl;
    private String administeredClubId;
    private String facultyDesignation;

    private String rollNo;
    private String department;
    private int semester;
    private int batch;
    private String phone;
    private List<String> interests;
    private int activityPointsTotal;

    private Instant createdAt;
}
