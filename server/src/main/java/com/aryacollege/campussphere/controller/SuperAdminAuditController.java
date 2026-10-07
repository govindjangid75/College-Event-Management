package com.aryacollege.campussphere.controller;

import com.aryacollege.campussphere.dto.ApiResponse;
import com.aryacollege.campussphere.model.PayoutSettlementRequest;
import com.aryacollege.campussphere.repository.PayoutRequestRepository;
import com.aryacollege.campussphere.service.ClubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class SuperAdminAuditController {

    private final ClubService clubService;
    private final PayoutRequestRepository payoutRequestRepository;

    @GetMapping("/treasury-audit")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCentralTreasuryAudit() {
        Map<String, Object> audit = clubService.getCampusTreasuryAudit();
        return ResponseEntity.ok(ApiResponse.ok("Live institutional campus financial audit retrieved", audit));
    }

    @GetMapping("/payout-queue")
    public ResponseEntity<ApiResponse<List<PayoutSettlementRequest>>> getPendingPayouts() {
        List<PayoutSettlementRequest> pending = payoutRequestRepository.findByStatusOrderByRequestedAtDesc("PENDING");
        return ResponseEntity.ok(ApiResponse.ok("Pending Dean payout queue retrieved", pending));
    }

    @PutMapping("/payouts/{id}/approve")
    public ResponseEntity<ApiResponse<PayoutSettlementRequest>> approvePayout(@PathVariable String id) {
        PayoutSettlementRequest req = clubService.approvePayoutByDean(id);
        return ResponseEntity.ok(ApiResponse.ok("Payout voucher " + req.getReferenceNumber() + " approved and disbursed!", req));
    }
}
