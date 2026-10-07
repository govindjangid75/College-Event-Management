package com.aryacollege.campussphere.service;

import com.aryacollege.campussphere.dto.*;
import com.aryacollege.campussphere.model.*;
import com.aryacollege.campussphere.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final VerifiedFeedbackRepository feedbackRepository;
    private final StudentSuggestionRepository suggestionRepository;
    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;

    /**
     * Submit Attendance-Gated 5-Vector Review.
     * Enforces that the student actually attended and was verified at the venue gate!
     */
    public VerifiedFeedback submitFeedback(FeedbackSubmissionDto dto) {
        // 1. Fetch Student Registration
        Optional<Registration> regOpt = registrationRepository.findByEventIdAndUserId(dto.getEventId(), dto.getUserId());
        if (regOpt.isEmpty()) {
            throw new IllegalArgumentException("Access Denied: You must be registered for this event to submit feedback.");
        }

        Registration reg = regOpt.get();

        // 2. Gate Attendance Check
        if (!reg.isAttendanceVerified()) {
            throw new IllegalStateException("Feedback Locked: You must have checked in and been verified at the venue gate to submit verified feedback.");
        }

        // 3. Prevent Duplicate Review
        if (feedbackRepository.findByEventIdAndUserId(dto.getEventId(), dto.getUserId()).isPresent()) {
            throw new IllegalStateException("You have already submitted verified feedback for this event.");
        }

        // 4. Fetch Event for Metadata
        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new IllegalArgumentException("Event not found with ID: " + dto.getEventId()));

        // 5. Compute 5-Vector Average
        double avg = (dto.getContentDepth() + dto.getOrganization() + dto.getSpeakerQuality() 
                + dto.getVenueFacilities() + dto.getValueForTime()) / 5.0;
        avg = Math.round(avg * 100.0) / 100.0;

        String sentiment = avg >= 3.8 ? "POSITIVE" : (avg >= 2.6 ? "NEUTRAL" : "NEGATIVE");

        VerifiedFeedback feedback = VerifiedFeedback.builder()
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .clubId(event.getClubId())
                .clubName(event.getClubName())
                .userId(dto.getUserId())
                .userName(dto.isAnonymous() ? "Verified Arya Student" : reg.getUserName())
                .userRollNo(dto.isAnonymous() ? "22EACIT***" : reg.getUserRollNo())
                .department(reg.getDepartment())
                .contentDepth(dto.getContentDepth())
                .organization(dto.getOrganization())
                .speakerQuality(dto.getSpeakerQuality())
                .venueFacilities(dto.getVenueFacilities())
                .valueForTime(dto.getValueForTime())
                .averageRating(avg)
                .reviewText(dto.getReviewText())
                .sentiment(sentiment)
                .anonymous(dto.isAnonymous())
                .createdAt(Instant.now())
                .build();

        VerifiedFeedback saved = feedbackRepository.save(feedback);

        // Mark registration as reviewed
        reg.setFeedbackSubmitted(true);
        registrationRepository.save(reg);

        return saved;
    }

    /**
     * Get Comprehensive 5-Vector Feedback Summary for an Event.
     */
    public EventFeedbackSummaryDto getEventFeedbackSummary(String eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found with ID: " + eventId));

        List<VerifiedFeedback> reviews = feedbackRepository.findByEventIdOrderByCreatedAtDesc(eventId);

        if (reviews.isEmpty()) {
            return EventFeedbackSummaryDto.builder()
                    .eventId(event.getId())
                    .eventTitle(event.getTitle())
                    .totalReviews(0)
                    .averageOverallRating(0.0)
                    .averageContentDepth(0.0)
                    .averageOrganization(0.0)
                    .averageSpeakerQuality(0.0)
                    .averageVenueFacilities(0.0)
                    .averageValueForTime(0.0)
                    .reviews(new ArrayList<>())
                    .build();
        }

        double totalOverall = 0, totalContent = 0, totalOrg = 0, totalSpeaker = 0, totalVenue = 0, totalValue = 0;
        for (VerifiedFeedback r : reviews) {
            totalOverall += r.getAverageRating();
            totalContent += r.getContentDepth();
            totalOrg += r.getOrganization();
            totalSpeaker += r.getSpeakerQuality();
            totalVenue += r.getVenueFacilities();
            totalValue += r.getValueForTime();
        }

        int n = reviews.size();
        return EventFeedbackSummaryDto.builder()
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .totalReviews(n)
                .averageOverallRating(Math.round((totalOverall / n) * 10.0) / 10.0)
                .averageContentDepth(Math.round((totalContent / n) * 10.0) / 10.0)
                .averageOrganization(Math.round((totalOrg / n) * 10.0) / 10.0)
                .averageSpeakerQuality(Math.round((totalSpeaker / n) * 10.0) / 10.0)
                .averageVenueFacilities(Math.round((totalVenue / n) * 10.0) / 10.0)
                .averageValueForTime(Math.round((totalValue / n) * 10.0) / 10.0)
                .reviews(reviews)
                .build();
    }

    public List<VerifiedFeedback> getClubFeedbacks(String clubId) {
        return feedbackRepository.findByClubIdOrderByCreatedAtDesc(clubId);
    }

    public List<VerifiedFeedback> getUserFeedbacks(String userId) {
        return feedbackRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Submit Student Suggestion for "You Said, We Did" loop.
     */
    public StudentSuggestion submitSuggestion(SuggestionSubmissionDto dto) {
        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new IllegalArgumentException("Event not found with ID: " + dto.getEventId()));

        Optional<Registration> regOpt = registrationRepository.findByEventIdAndUserId(dto.getEventId(), dto.getUserId());
        String authorName = regOpt.map(Registration::getUserName).orElse("Arya Student");
        String authorRoll = regOpt.map(Registration::getUserRollNo).orElse("22EACIT089");

        List<String> upvotedUsers = new ArrayList<>();
        upvotedUsers.add(dto.getUserId());

        StudentSuggestion suggestion = StudentSuggestion.builder()
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .clubId(event.getClubId())
                .clubName(event.getClubName())
                .authorUserId(dto.getUserId())
                .authorName(authorName)
                .authorRollNo(authorRoll)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .upvotesCount(1)
                .upvotedByUserIds(upvotedUsers)
                .kanbanStatus("SUBMITTED")
                .createdAt(Instant.now())
                .build();

        return suggestionRepository.save(suggestion);
    }

    /**
     * Upvote a student suggestion.
     */
    public StudentSuggestion upvoteSuggestion(String suggestionId, String userId) {
        StudentSuggestion suggestion = suggestionRepository.findById(suggestionId)
                .orElseThrow(() -> new IllegalArgumentException("Suggestion not found: " + suggestionId));

        if (suggestion.getUpvotedByUserIds() == null) {
            suggestion.setUpvotedByUserIds(new ArrayList<>());
        }

        if (suggestion.getUpvotedByUserIds().contains(userId)) {
            // Undo upvote
            suggestion.getUpvotedByUserIds().remove(userId);
            suggestion.setUpvotesCount(Math.max(1, suggestion.getUpvotesCount() - 1));
        } else {
            suggestion.getUpvotedByUserIds().add(userId);
            suggestion.setUpvotesCount(suggestion.getUpvotesCount() + 1);
        }

        return suggestionRepository.save(suggestion);
    }

    /**
     * Update Suggestion Kanban Status & Action Proof (Club Admin).
     */
    public StudentSuggestion updateKanbanStatus(KanbanStatusUpdateDto dto) {
        StudentSuggestion suggestion = suggestionRepository.findById(dto.getSuggestionId())
                .orElseThrow(() -> new IllegalArgumentException("Suggestion not found: " + dto.getSuggestionId()));

        suggestion.setKanbanStatus(dto.getNewStatus());
        if (dto.getAdminId() != null) suggestion.setRespondedByAdminId(dto.getAdminId());
        if (dto.getAdminName() != null) suggestion.setRespondedByAdminName(dto.getAdminName());
        if (dto.getResponseText() != null) suggestion.setClubActionResponseText(dto.getResponseText());
        if (dto.getProofImageUrl() != null) suggestion.setProofImageUrl(dto.getProofImageUrl());

        if ("IMPLEMENTED".equalsIgnoreCase(dto.getNewStatus())) {
            suggestion.setResolvedAt(Instant.now());
        }

        return suggestionRepository.save(suggestion);
    }

    public List<StudentSuggestion> getEventSuggestions(String eventId) {
        return suggestionRepository.findByEventIdOrderByUpvotesCountDesc(eventId);
    }

    public List<StudentSuggestion> getClubSuggestions(String clubId) {
        return suggestionRepository.findByClubIdOrderByUpvotesCountDesc(clubId);
    }
}
