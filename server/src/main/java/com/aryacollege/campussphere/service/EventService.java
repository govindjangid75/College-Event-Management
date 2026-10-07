package com.aryacollege.campussphere.service;

import com.aryacollege.campussphere.dto.EventProposalDto;
import com.aryacollege.campussphere.dto.VenueClashCheckDto;
import com.aryacollege.campussphere.dto.VenueClashResultDto;
import com.aryacollege.campussphere.model.Club;
import com.aryacollege.campussphere.model.Event;
import com.aryacollege.campussphere.model.Venue;
import com.aryacollege.campussphere.repository.ClubRepository;
import com.aryacollege.campussphere.repository.EventRepository;
import com.aryacollege.campussphere.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final ClubRepository clubRepository;
    private final VenueRepository venueRepository;
    private final VenueClashEngineService venueClashEngineService;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    /**
     * Propose a new event by Club Admin with mandatory 30-min buffer clash detection.
     */
    public Event proposeEvent(EventProposalDto dto) {
        // 1. Validate Club
        Club club = clubRepository.findById(dto.getClubId())
            .or(() -> clubRepository.findBySlug(dto.getClubId()))
            .orElseThrow(() -> new IllegalArgumentException("Organizing club not found: " + dto.getClubId()));

        // 2. Validate Venue
        Venue venue = venueRepository.findById(dto.getVenueId())
            .or(() -> venueRepository.findByCode(dto.getVenueId()))
            .orElseThrow(() -> new IllegalArgumentException("Venue not found: " + dto.getVenueId()));

        // 3. Check Venue Collision Buffer Engine
        VenueClashCheckDto clashCheck = VenueClashCheckDto.builder()
            .venueId(venue.getId())
            .startTime(dto.getStartTime())
            .endTime(dto.getEndTime())
            .build();

        VenueClashResultDto clashResult = venueClashEngineService.checkVenueCollision(clashCheck);
        if (clashResult.isClash()) {
            throw new IllegalStateException(clashResult.getBufferExplanation());
        }

        // 4. Generate unique slug
        String baseSlug = toSlug(dto.getTitle());
        String slug = baseSlug + "-" + UUID.randomUUID().toString().substring(0, 6);

        // 5. Build and save Event document
        Event event = Event.builder()
            .slug(slug)
            .title(dto.getTitle())
            .clubId(club.getId())
            .clubName(club.getName())
            .clubLogoUrl(club.getLogoUrl())
            .category(dto.getCategory())
            .tags(dto.getTags() != null ? dto.getTags() : List.of())
            .shortSummary(dto.getShortSummary())
            .descriptionMarkdown(dto.getDescriptionMarkdown() != null ? dto.getDescriptionMarkdown() : dto.getShortSummary())
            .bannerImage(dto.getBannerImage() != null ? dto.getBannerImage() : club.getBannerUrl())
            .venueId(venue.getId())
            .venueName(venue.getName())
            .startTime(dto.getStartTime())
            .endTime(dto.getEndTime())
            .registrationDeadline(dto.getRegistrationDeadline() != null ? dto.getRegistrationDeadline() : dto.getStartTime())
            .registrationType(dto.getRegistrationType() != null ? dto.getRegistrationType() : "SOLO")
            .minTeamSize(dto.getMinTeamSize() > 0 ? dto.getMinTeamSize() : 2)
            .maxTeamSize(dto.getMaxTeamSize() > 0 ? dto.getMaxTeamSize() : 4)
            .isPaid(dto.isPaid())
            .ticketPrice(dto.getTicketPrice())
            .maxCapacity(dto.getMaxCapacity() > 0 ? dto.getMaxCapacity() : 100)
            .registeredCount(0)
            .waitlistCount(0)
            .activityPointsAwarded(dto.getActivityPointsAwarded())
            .status("PENDING_APPROVAL") // Gated until Super Admin Dean approval
            .createdAt(Instant.now())
            .build();

        return eventRepository.save(event);
    }

    /**
     * Dean / Super Admin approves event proposal.
     */
    public Event approveEvent(String eventId, String approvedBy, String comments) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new IllegalArgumentException("Event not found with ID: " + eventId));

        event.setStatus("APPROVED");
        event.setApprovedBy(approvedBy != null ? approvedBy : "Dr. R. K. Sharma (Dean Academics)");
        event.setApprovalComments(comments != null ? comments : "Sanctioned by Dean Office. Venue reservation confirmed.");
        event.setApprovedAt(Instant.now());

        return eventRepository.save(event);
    }

    /**
     * Dean / Super Admin rejects event proposal with feedback.
     */
    public Event rejectEvent(String eventId, String rejectedBy, String comments) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new IllegalArgumentException("Event not found with ID: " + eventId));

        event.setStatus("REJECTED");
        event.setApprovedBy(rejectedBy != null ? rejectedBy : "Dean Office");
        event.setApprovalComments(comments != null ? comments : "Proposal does not meet semester academic schedule.");
        event.setApprovedAt(Instant.now());

        return eventRepository.save(event);
    }

    public List<Event> getAllEvents(String status, String category, String clubId) {
        if (status != null && !status.isEmpty()) {
            return eventRepository.findByStatus(status);
        }
        if (clubId != null && !clubId.isEmpty()) {
            return eventRepository.findByClubId(clubId);
        }
        return eventRepository.findAllByOrderByStartTimeAsc();
    }

    public Optional<Event> getEventBySlug(String slug) {
        return eventRepository.findBySlug(slug);
    }

    public Optional<Event> getEventById(String id) {
        return eventRepository.findById(id);
    }

    private String toSlug(String input) {
        String nowhitespace = WHITESPACE.matcher(input.toLowerCase()).replaceAll("-");
        return NONLATIN.matcher(nowhitespace).replaceAll("");
    }
}
