package com.aryacollege.campussphere.controller;

import com.aryacollege.campussphere.dto.AicteTranscriptDto;
import com.aryacollege.campussphere.dto.ApiResponse;
import com.aryacollege.campussphere.model.Certificate;
import com.aryacollege.campussphere.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CertificateController {

    private final CertificateService certificateService;

    /**
     * Claim or Generate E-Certificate upon Gate Attendance Verification.
     */
    @PostMapping("/claim")
    public ResponseEntity<ApiResponse<Certificate>> claimCertificate(
            @RequestParam String eventId,
            @RequestParam String userId
    ) {
        Certificate cert = certificateService.claimOrGenerateCertificate(eventId, userId);
        return ResponseEntity.ok(ApiResponse.ok("Certificate generated and cryptographically sealed!", cert));
    }

    /**
     * Get all certificates awarded to a student.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Certificate>>> getUserCertificates(@PathVariable String userId) {
        List<Certificate> certs = certificateService.getUserCertificates(userId);
        return ResponseEntity.ok(ApiResponse.ok("User certificates retrieved", certs));
    }

    /**
     * Get certificates issued for an event.
     */
    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<Certificate>>> getEventCertificates(@PathVariable String eventId) {
        List<Certificate> certs = certificateService.getEventCertificates(eventId);
        return ResponseEntity.ok(ApiResponse.ok("Event certificates retrieved", certs));
    }

    /**
     * Public Certificate Verification (Open to Recruiters, Companies, Faculty).
     */
    @GetMapping("/verify/{certificateId}")
    public ResponseEntity<ApiResponse<Certificate>> verifyCertificatePublic(@PathVariable String certificateId) {
        try {
            Certificate cert = certificateService.verifyCertificatePublic(certificateId);
            return ResponseEntity.ok(ApiResponse.ok("Authentic Arya College Credential Verified ✓", cert));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Official Signed AICTE / RTU Activity Points Transcript.
     */
    @GetMapping("/transcript/{userId}")
    public ResponseEntity<ApiResponse<AicteTranscriptDto>> getUserAicteTranscript(
            @PathVariable String userId,
            @RequestParam(required = false) String studentName,
            @RequestParam(required = false) String rollNo,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer semester,
            @RequestParam(required = false) Integer batch) {
        AicteTranscriptDto transcript = certificateService.getUserAicteTranscript(userId, studentName, rollNo, department, semester, batch);
        return ResponseEntity.ok(ApiResponse.ok("Official AICTE transcript generated", transcript));
    }
}
