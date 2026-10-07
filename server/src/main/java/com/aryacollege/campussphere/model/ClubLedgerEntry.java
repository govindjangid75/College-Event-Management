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
@Document(collection = "club_ledger")
public class ClubLedgerEntry {

    @Id
    private String id;

    @Indexed
    private String clubId;
    private String clubName;

    private String eventId;
    private String eventTitle;

    private String type; // "TICKET_SALE" | "PAYOUT_DISBURSEMENT" | "REFUND"
    private double creditAmount;
    private double debitAmount;
    private double gatewayFee;
    private double netAmount;
    private double runningBalance;
    private String remarks;
    private String referenceId;
    private String status; // "SETTLED" | "PENDING"
    private Instant timestamp;
}
