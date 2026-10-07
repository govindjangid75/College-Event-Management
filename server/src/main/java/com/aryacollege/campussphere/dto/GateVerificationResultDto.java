package com.aryacollege.campussphere.dto;

import com.aryacollege.campussphere.model.Registration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GateVerificationResultDto {

    private boolean verified;
    private boolean alreadyCheckedIn;
    private String message;
    private String studentName;
    private String studentRollNo;
    private String department;
    private String eventTitle;
    private String ticketNumber;
    private int activityPointsAwarded;
    private Instant checkedInAt;
    private Registration registration;
}
