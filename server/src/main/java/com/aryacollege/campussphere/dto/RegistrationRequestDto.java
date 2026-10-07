package com.aryacollege.campussphere.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationRequestDto {

    @NotBlank(message = "eventId is required")
    private String eventId;

    @NotBlank(message = "userId is required")
    private String userId;

    private String userName;
    private String userEmail;
    private String userRollNo;
    private String department;
    private int semester;

    @Builder.Default
    private String registrationType = "SOLO"; // "SOLO" | "TEAM"

    private String teamName;
    private String teamPasscode;
    private List<String> teamMembers;

    // Razorpay payment ID (for paid events)
    private String paymentId;
}
