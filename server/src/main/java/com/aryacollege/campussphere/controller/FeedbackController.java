package com.aryacollege.campussphere.controller;

import com.aryacollege.campussphere.dto.*;
import com.aryacollege.campussphere.model.StudentSuggestion;
import com.aryacollege.campussphere.model.VerifiedFeedback;
import com.aryacollege.campussphere.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FeedbackController {

    private final FeedbackService feedbackService;

    /**
     * Submit Attendance-Gated 5-Vector Review.
     */
    @PostMapping("/feedback/submit")
    public ResponseEntity<ApiResponse<VerifiedFeedback>> submitFeedback(@Valid @RequestBody FeedbackSubmissionDto dto) {
        VerifiedFeedback feedback = feedbackService.submitFeedback(dto);
        return ResponseEntity.ok(ApiResponse.ok("Verified feedback submitted successfully!", feedback));
    }

    /**
     * Get 5-Vector Review Summary for an Event.
     */
    @GetMapping("/feedback/event/{eventId}/summary")
    public ResponseEntity<ApiResponse<EventFeedbackSummaryDto>> getEventFeedbackSummary(@PathVariable String eventId) {
        EventFeedbackSummaryDto summary = feedbackService.getEventFeedbackSummary(eventId);
        return ResponseEntity.ok(ApiResponse.ok("Event feedback summary retrieved", summary));
    }

    /**
     * Get all verified reviews for a club.
     */
    @GetMapping("/feedback/club/{clubId}")
    public ResponseEntity<ApiResponse<List<VerifiedFeedback>>> getClubFeedbacks(@PathVariable String clubId) {
        List<VerifiedFeedback> reviews = feedbackService.getClubFeedbacks(clubId);
        return ResponseEntity.ok(ApiResponse.ok("Club feedbacks retrieved", reviews));
    }

    /**
     * Get reviews submitted by a student.
     */
    @GetMapping("/feedback/user/{userId}")
    public ResponseEntity<ApiResponse<List<VerifiedFeedback>>> getUserFeedbacks(@PathVariable String userId) {
        List<VerifiedFeedback> reviews = feedbackService.getUserFeedbacks(userId);
        return ResponseEntity.ok(ApiResponse.ok("User feedbacks retrieved", reviews));
    }

    // --- SUGGESTIONS & YOU-SAID-WE-DID KANBAN ENDPOINTS ---

    /**
     * Post a Student Suggestion.
     */
    @PostMapping("/suggestions/submit")
    public ResponseEntity<ApiResponse<StudentSuggestion>> submitSuggestion(@Valid @RequestBody SuggestionSubmissionDto dto) {
        StudentSuggestion suggestion = feedbackService.submitSuggestion(dto);
        return ResponseEntity.ok(ApiResponse.ok("Student suggestion posted successfully!", suggestion));
    }

    /**
     * Upvote a Suggestion.
     */
    @PostMapping("/suggestions/{id}/upvote")
    public ResponseEntity<ApiResponse<StudentSuggestion>> upvoteSuggestion(@PathVariable String id, @RequestParam String userId) {
        StudentSuggestion updated = feedbackService.upvoteSuggestion(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Upvote updated", updated));
    }

    /**
     * Update Kanban Status (Club Admin Action Loop).
     */
    @PutMapping({"/suggestions/kanban-status", "/suggestions/{id}/status"})
    public ResponseEntity<ApiResponse<StudentSuggestion>> updateKanbanStatus(
            @PathVariable(required = false) String id,
            @Valid @RequestBody KanbanStatusUpdateDto dto
    ) {
        if (id != null && (dto.getSuggestionId() == null || dto.getSuggestionId().isBlank())) {
            dto.setSuggestionId(id);
        }
        StudentSuggestion updated = feedbackService.updateKanbanStatus(dto);
        return ResponseEntity.ok(ApiResponse.ok("Kanban status updated!", updated));
    }

    /**
     * Get Suggestions for an Event.
     */
    @GetMapping("/suggestions/event/{eventId}")
    public ResponseEntity<ApiResponse<List<StudentSuggestion>>> getEventSuggestions(@PathVariable String eventId) {
        List<StudentSuggestion> list = feedbackService.getEventSuggestions(eventId);
        return ResponseEntity.ok(ApiResponse.ok("Event suggestions retrieved", list));
    }

    /**
     * Get Suggestions for a Club.
     */
    @GetMapping("/suggestions/club/{clubId}")
    public ResponseEntity<ApiResponse<List<StudentSuggestion>>> getClubSuggestions(@PathVariable String clubId) {
        List<StudentSuggestion> list = feedbackService.getClubSuggestions(clubId);
        return ResponseEntity.ok(ApiResponse.ok("Club suggestions retrieved", list));
    }
}
