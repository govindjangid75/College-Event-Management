package com.aryacollege.campussphere.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GateVerificationRequestDto {

    @NotBlank(message = "ticketNumber is required")
    private String ticketNumber;

    // Optional rolling HMAC signature from dynamic QR
    private String hmacSignature;
    private Long timestampWindow;

    private String adminId;
    private String gateLocation;
}
