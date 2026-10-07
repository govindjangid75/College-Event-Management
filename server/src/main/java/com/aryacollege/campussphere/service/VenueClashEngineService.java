package com.aryacollege.campussphere.service;

import com.aryacollege.campussphere.dto.VenueClashCheckDto;
import com.aryacollege.campussphere.dto.VenueClashResultDto;
import com.aryacollege.campussphere.model.Event;
import com.aryacollege.campussphere.model.Venue;
import com.aryacollege.campussphere.repository.EventRepository;
import com.aryacollege.campussphere.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueClashEngineService {

    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;

    @Value("${campussphere.venue.setup-buffer-minutes:30}")
    private int setupBufferMinutes;

    @Value("${campussphere.venue.cleanup-buffer-minutes:30}")
    private int cleanupBufferMinutes;

    /**
     * Institutional Venue Collision Engine:
     * Evaluates requested event slot against existing approved and pending events at the target venue.
     * Enforces strict setup buffer (default 30 mins) before and cleanup buffer (default 30 mins) after every event.
     */
    public VenueClashResultDto checkVenueCollision(VenueClashCheckDto request) {
        Instant reqStart = request.getStartTime();
        Instant reqEnd = request.getEndTime();

        if (reqEnd.isBefore(reqStart) || reqEnd.equals(reqStart)) {
            return VenueClashResultDto.builder()
                .isClash(true)
                .bufferExplanation("Invalid event timeframe: End time must be strictly after Start time.")
                .build();
        }

        // Calculate requested occupied window including mandatory setup & cleanup buffers
        Instant reqOccupiedStart = reqStart.minus(setupBufferMinutes, ChronoUnit.MINUTES);
        Instant reqOccupiedEnd = reqEnd.plus(cleanupBufferMinutes, ChronoUnit.MINUTES);

        // Fetch all active/pending events for this venue
        List<Event> existingEvents = eventRepository.findByVenueIdAndStatusIn(
            request.getVenueId(),
            List.of("APPROVED", "PENDING_APPROVAL", "LIVE")
        );

        for (Event existing : existingEvents) {
            // Skip the event itself if updating an existing event
            if (request.getExcludeEventId() != null && request.getExcludeEventId().equals(existing.getId())) {
                continue;
            }

            // Existing event's occupied window with buffer
            Instant existOccupiedStart = existing.getStartTime().minus(setupBufferMinutes, ChronoUnit.MINUTES);
            Instant existOccupiedEnd = existing.getEndTime().plus(cleanupBufferMinutes, ChronoUnit.MINUTES);

            // Overlap check: [A, B] overlaps with [C, D] iff A < D and C < B
            boolean overlaps = reqOccupiedStart.isBefore(existOccupiedEnd) && existOccupiedStart.isBefore(reqOccupiedEnd);

            if (overlaps) {
                // Collision detected! Determine alternative venues
                List<Venue> alternatives = findAvailableVenues(reqStart, reqEnd, request.getVenueId());

                String explanation = String.format(
                    "Venue Collision Detected! '%s' organized by %s is scheduled from %s to %s. " +
                    "Arya College institutional rules mandate a %d-min setup buffer before and %d-min teardown buffer after every booking.",
                    existing.getTitle(),
                    existing.getClubName() != null ? existing.getClubName() : "Organizer",
                    existing.getStartTime().toString(),
                    existing.getEndTime().toString(),
                    setupBufferMinutes,
                    cleanupBufferMinutes
                );

                return VenueClashResultDto.builder()
                    .isClash(true)
                    .conflictingEventId(existing.getId())
                    .conflictingEventTitle(existing.getTitle())
                    .conflictingClubName(existing.getClubName())
                    .conflictingSchedule(existing.getStartTime() + " - " + existing.getEndTime())
                    .bufferExplanation(explanation)
                    .alternativeVenues(alternatives)
                    .build();
            }
        }

        // No clash detected
        return VenueClashResultDto.builder()
            .isClash(false)
            .bufferExplanation(String.format(
                "Venue available! Slot confirmed with %d-min setup and %d-min teardown buffers honored.",
                setupBufferMinutes, cleanupBufferMinutes
            ))
            .alternativeVenues(List.of())
            .build();
    }

    /**
     * Find alternative institutional venues that are free during the requested timeframe.
     */
    public List<Venue> findAvailableVenues(Instant start, Instant end, String excludeVenueId) {
        List<Venue> allVenues = venueRepository.findAll();
        List<Venue> available = new ArrayList<>();

        Instant reqOccupiedStart = start.minus(setupBufferMinutes, ChronoUnit.MINUTES);
        Instant reqOccupiedEnd = end.plus(cleanupBufferMinutes, ChronoUnit.MINUTES);

        for (Venue venue : allVenues) {
            if (venue.getId().equals(excludeVenueId) || !venue.isActive()) {
                continue;
            }

            List<Event> venueEvents = eventRepository.findByVenueIdAndStatusIn(
                venue.getId(),
                List.of("APPROVED", "PENDING_APPROVAL", "LIVE")
            );

            boolean hasClash = false;
            for (Event e : venueEvents) {
                Instant existOccupiedStart = e.getStartTime().minus(setupBufferMinutes, ChronoUnit.MINUTES);
                Instant existOccupiedEnd = e.getEndTime().plus(cleanupBufferMinutes, ChronoUnit.MINUTES);
                if (reqOccupiedStart.isBefore(existOccupiedEnd) && existOccupiedStart.isBefore(reqOccupiedEnd)) {
                    hasClash = true;
                    break;
                }
            }

            if (!hasClash) {
                available.add(venue);
            }
        }

        return available;
    }
}
