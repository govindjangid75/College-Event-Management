package com.aryacollege.campussphere.service;

import com.aryacollege.campussphere.model.Club;
import com.aryacollege.campussphere.model.ClubLedgerEntry;
import com.aryacollege.campussphere.model.PayoutSettlementRequest;
import com.aryacollege.campussphere.repository.ClubApplicationRepository;
import com.aryacollege.campussphere.repository.ClubLedgerRepository;
import com.aryacollege.campussphere.repository.ClubRepository;
import com.aryacollege.campussphere.repository.PayoutRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ClubService {

    private final ClubRepository clubRepository;
    private final ClubLedgerRepository clubLedgerRepository;
    private final PayoutRequestRepository payoutRequestRepository;
    private final ClubApplicationRepository clubApplicationRepository;

    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    public Optional<Club> getClubBySlug(String slug) {
        return clubRepository.findBySlug(slug);
    }

    public Optional<Club> getClubById(String id) {
        return clubRepository.findById(id);
    }

    public Club updateClubProfile(String id, Club updates) {
        Club club = clubRepository.findById(id)
            .or(() -> clubRepository.findBySlug(id))
            .orElseThrow(() -> new IllegalArgumentException("Club not found: " + id));

        if (updates.getTagline() != null) club.setTagline(updates.getTagline());
        if (updates.getDescription() != null) club.setDescription(updates.getDescription());
        if (updates.getFacultyCoordinator() != null) club.setFacultyCoordinator(updates.getFacultyCoordinator());
        if (updates.getMeetingSchedule() != null) club.setMeetingSchedule(updates.getMeetingSchedule());
        if (updates.getRecruitmentStatus() != null) club.setRecruitmentStatus(updates.getRecruitmentStatus());

        if (updates.getTreasury() != null && updates.getTreasury().getPayoutUpiId() != null) {
            club.getTreasury().setPayoutUpiId(updates.getTreasury().getPayoutUpiId());
        }

        return clubRepository.save(club);
    }

    public List<ClubLedgerEntry> getClubLedger(String clubId) {
        return clubLedgerRepository.findByClubIdOrderByTimestampDesc(clubId);
    }

    /**
     * Request payout disbursement from dedicated club treasury
     */
    public PayoutSettlementRequest requestPayout(String clubId, double amount, String upiId, String requestedByUserId, String requestedByUserName) {
        Club club = clubRepository.findById(clubId)
            .or(() -> clubRepository.findBySlug(clubId))
            .orElseThrow(() -> new IllegalArgumentException("Club not found: " + clubId));

        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than ₹0");
        }

        if (amount > club.getTreasury().getAvailableBalance()) {
            throw new IllegalStateException("Insufficient funds in dedicated treasury. Available: ₹" + club.getTreasury().getAvailableBalance());
        }

        String refNum = "DISB-ACEIT-2026-" + (int)(100 + Math.random() * 900);
        double newBalance = club.getTreasury().getAvailableBalance() - amount;

        // 1. Update Club balance in MongoDB
        club.getTreasury().setAvailableBalance(newBalance);
        club.getTreasury().setPendingSettlement(club.getTreasury().getPendingSettlement() + amount);
        clubRepository.save(club);

        // 2. Add Ledger entry to MongoDB
        ClubLedgerEntry ledgerEntry = ClubLedgerEntry.builder()
            .clubId(club.getId())
            .clubName(club.getName())
            .type("PAYOUT_DISBURSEMENT")
            .creditAmount(0)
            .debitAmount(amount)
            .gatewayFee(0)
            .netAmount(-amount)
            .runningBalance(newBalance)
            .remarks("Payout requested to " + upiId)
            .referenceId(refNum)
            .status("PENDING")
            .timestamp(Instant.now())
            .build();
        clubLedgerRepository.save(ledgerEntry);

        // 3. Save Payout Request in MongoDB
        PayoutSettlementRequest request = PayoutSettlementRequest.builder()
            .clubId(club.getId())
            .clubName(club.getName())
            .requestedByUserId(requestedByUserId)
            .requestedByUserName(requestedByUserName)
            .amount(amount)
            .payoutUpiId(upiId)
            .status("PENDING")
            .referenceNumber(refNum)
            .deanApprovalStatus("PENDING")
            .requestedAt(Instant.now())
            .build();

        return payoutRequestRepository.save(request);
    }

    /**
     * Dean / Super Admin approves payout request in MongoDB
     */
    public PayoutSettlementRequest approvePayoutByDean(String requestId) {
        PayoutSettlementRequest req = payoutRequestRepository.findById(requestId)
            .orElseThrow(() -> new IllegalArgumentException("Payout request not found: " + requestId));

        req.setStatus("DISBURSED");
        req.setDeanApprovalStatus("APPROVED");
        req.setDisbursedAt(Instant.now());
        payoutRequestRepository.save(req);

        // Clear pending from club
        clubRepository.findById(req.getClubId()).ifPresent(club -> {
            club.getTreasury().setPendingSettlement(Math.max(0, club.getTreasury().getPendingSettlement() - req.getAmount()));
            clubRepository.save(club);
        });

        return req;
    }

    /**
     * Institutional Campus Financial Overview aggregated from all clubs in MongoDB
     */
    public Map<String, Object> getCampusTreasuryAudit() {
        List<Club> clubs = clubRepository.findAll();
        double totalBalance = 0;
        double totalRevenue = 0;
        double totalPending = 0;

        List<Map<String, Object>> breakdown = new ArrayList<>();
        for (Club c : clubs) {
            totalBalance += c.getTreasury().getAvailableBalance();
            totalRevenue += c.getTreasury().getTotalRevenue();
            totalPending += c.getTreasury().getPendingSettlement();

            Map<String, Object> item = new HashMap<>();
            item.put("clubId", c.getId());
            item.put("clubSlug", c.getSlug());
            item.put("clubName", c.getName());
            item.put("category", c.getCategory());
            item.put("availableBalance", c.getTreasury().getAvailableBalance());
            item.put("totalRevenue", c.getTreasury().getTotalRevenue());
            item.put("pendingSettlement", c.getTreasury().getPendingSettlement());
            item.put("payoutUpiId", c.getTreasury().getPayoutUpiId());
            breakdown.add(item);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalCampusBalance", totalBalance);
        result.put("totalGrossRevenue", totalRevenue);
        result.put("totalPendingSettlements", totalPending);
        result.put("clubCount", clubs.size());
        result.put("clubsBreakdown", breakdown);
        return result;
    }
}
