package com.aryacollege.campussphere.dto;

import com.aryacollege.campussphere.model.Certificate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AicteTranscriptDto {

    private String userId;
    private String studentName;
    private String rollNo;
    private String department;
    private int semester;
    private int batch;

    private int totalActivityPointsEarned;
    @Builder.Default
    private int requiredHonorsPoints = 100;
    private boolean honorsEligible;
    private double completionPercentage;

    private Map<String, Integer> categoryPointsBreakdown;
    private List<Certificate> earnedCertificates;

    @Builder.Default
    private String certifiedBy = "Dr. R. K. Sharma (Dean Academics & RTU Compliance Coordinator)";
    @Builder.Default
    private Instant generatedAt = Instant.now();
}
