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
@Document(collection = "payout_requests")
public class PayoutSettlementRequest {

    @Id
    private String id;

    @Indexed
    private String clubId;
    private String clubName;

    private String requestedByUserId;
    private String requestedByUserName;
    private double amount;
    private String payoutUpiId;
    private String status; // "PENDING" | "APPROVED" | "DISBURSED" | "REJECTED"
    private String referenceNumber;
    private String deanApprovalStatus; // "PENDING" | "APPROVED"
    private Instant requestedAt;
    private Instant disbursedAt;
}
