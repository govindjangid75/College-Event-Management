package com.aryacollege.campussphere.controller;

import com.aryacollege.campussphere.dto.ApiResponse;
import com.aryacollege.campussphere.dto.GateVerificationRequestDto;
import com.aryacollege.campussphere.dto.GateVerificationResultDto;
import com.aryacollege.campussphere.dto.RegistrationRequestDto;
import com.aryacollege.campussphere.model.Registration;
import com.aryacollege.campussphere.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RegistrationController {

    private final RegistrationService registrationService;

    /**
     * Student Event Registration:
     * Issues dynamic ticket pass and automatically credits club treasury if paid.
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Registration>> register(@Valid @RequestBody RegistrationRequestDto dto) {
        Registration reg = registrationService.registerForEvent(dto);
        return ResponseEntity.ok(ApiResponse.ok("Event registration confirmed! Ticket pass issued.", reg));
    }

    /**
     * Gate Scanner Checkin Endpoint:
     * Scans and verifies dynamic rolling QR pass at campus gate.
     */
    @PostMapping("/verify-gate-ticket")
    public ResponseEntity<ApiResponse<GateVerificationResultDto>> verifyGateTicket(@Valid @RequestBody GateVerificationRequestDto dto) {
        GateVerificationResultDto result = registrationService.verifyGateTicket(dto);
        return ResponseEntity.ok(ApiResponse.ok(
            result.isVerified() ? "Access Granted: Attendance Verified" : (result.isAlreadyCheckedIn() ? "Duplicate Entry Detected" : "Verification Failed"),
            result
        ));
    }

    /**
     * Get all passes acquired by a student (Student View).
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Registration>>> getUserPasses(@PathVariable String userId) {
        List<Registration> passes = registrationService.getUserRegistrations(userId);
        return ResponseEntity.ok(ApiResponse.ok("User passes retrieved successfully", passes));
    }

    /**
     * Get attendee list for an event (Club Admin View).
     */
    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<Registration>>> getEventAttendees(@PathVariable String eventId) {
        List<Registration> attendees = registrationService.getEventRegistrations(eventId);
        return ResponseEntity.ok(ApiResponse.ok("Event attendees retrieved successfully", attendees));
    }

    /**
     * Get all attendees across all events for a club (Club Admin View).
     */
    @GetMapping("/club/{clubId}")
    public ResponseEntity<ApiResponse<List<Registration>>> getClubAttendees(@PathVariable String clubId) {
        List<Registration> attendees = registrationService.getClubRegistrations(clubId);
        return ResponseEntity.ok(ApiResponse.ok("Club attendees retrieved successfully", attendees));
    }
}
