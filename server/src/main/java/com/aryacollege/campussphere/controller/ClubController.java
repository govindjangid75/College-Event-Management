package com.aryacollege.campussphere.controller;

import com.aryacollege.campussphere.dto.ApiResponse;
import com.aryacollege.campussphere.model.Club;
import com.aryacollege.campussphere.model.ClubLedgerEntry;
import com.aryacollege.campussphere.model.PayoutSettlementRequest;
import com.aryacollege.campussphere.service.ClubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
public class ClubController {

    private final ClubService clubService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Club>>> getAllClubs() {
        List<Club> clubs = clubService.getAllClubs();
        return ResponseEntity.ok(ApiResponse.ok("Master 15 Clubs retrieved from MongoDB Atlas", clubs));
    }

    @GetMapping("/{slugOrId}")
    public ResponseEntity<ApiResponse<Club>> getClub(@PathVariable String slugOrId) {
        return clubService.getClubBySlug(slugOrId)
            .or(() -> clubService.getClubById(slugOrId))
            .map(c -> ResponseEntity.ok(ApiResponse.ok("Club retrieved", c)))
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Club not found: " + slugOrId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Club>> updateClubProfile(
            @PathVariable String id,
            @RequestBody Club updates) {
        try {
            Club updated = clubService.updateClubProfile(id, updates);
            return ResponseEntity.ok(ApiResponse.ok("Club profile successfully updated in MongoDB Atlas!", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}/ledger")
    public ResponseEntity<ApiResponse<List<ClubLedgerEntry>>> getClubLedger(@PathVariable String id) {
        List<ClubLedgerEntry> ledger = clubService.getClubLedger(id);
        return ResponseEntity.ok(ApiResponse.ok("Dedicated club ledger retrieved from MongoDB Atlas", ledger));
    }

    @PostMapping("/{id}/payout-request")
    public ResponseEntity<ApiResponse<PayoutSettlementRequest>> requestPayout(
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {
        try {
            double amount = Double.parseDouble(body.get("amount").toString());
            String upiId = body.get("upiId").toString();
            String userId = body.getOrDefault("userId", "user_club_admin_1").toString();
            String userName = body.getOrDefault("userName", "Priya Verma").toString();

            PayoutSettlementRequest req = clubService.requestPayout(id, amount, upiId, userId, userName);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Payout request registered in MongoDB Atlas! Voucher: " + req.getReferenceNumber(), req));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error(e.getMessage()));
        }
    }
}
