package com.aryacollege.campussphere.controller;

import com.aryacollege.campussphere.dto.ApiResponse;
import com.aryacollege.campussphere.dto.EventProposalDto;
import com.aryacollege.campussphere.model.Event;
import com.aryacollege.campussphere.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Event>>> getEvents(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String clubId) {
        List<Event> events = eventService.getAllEvents(status, category, clubId);
        return ResponseEntity.ok(ApiResponse.ok("Events retrieved successfully", events));
    }

    @GetMapping("/{slugOrId}")
    public ResponseEntity<ApiResponse<Event>> getEvent(@PathVariable String slugOrId) {
        return eventService.getEventBySlug(slugOrId)
            .or(() -> eventService.getEventById(slugOrId))
            .map(e -> ResponseEntity.ok(ApiResponse.ok("Event retrieved", e)))
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Event not found with identifier: " + slugOrId)));
    }

    /**
     * Propose new event (Club Admin) with mandatory 30-min buffer clash detection
     */
    @PostMapping("/propose")
    public ResponseEntity<ApiResponse<?>> proposeEvent(@Valid @RequestBody EventProposalDto proposalDto) {
        try {
            Event created = eventService.proposeEvent(proposalDto);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Event proposal submitted for Dean approval! Venue reservation held.", created));
        } catch (IllegalStateException e) {
            // Venue collision detected by Venue Buffer Engine
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Dean / Super Admin approves event proposal
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<Event>> approveEvent(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body) {
        String approvedBy = body != null ? body.get("approvedBy") : null;
        String comments = body != null ? body.get("comments") : null;
        try {
            Event approved = eventService.approveEvent(id, approvedBy, comments);
            return ResponseEntity.ok(ApiResponse.ok("Event proposal approved and published to campus calendar!", approved));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Dean / Super Admin rejects event proposal
     */
    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<Event>> rejectEvent(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body) {
        String rejectedBy = body != null ? body.get("rejectedBy") : null;
        String comments = body != null ? body.get("comments") : null;
        try {
            Event rejected = eventService.rejectEvent(id, rejectedBy, comments);
            return ResponseEntity.ok(ApiResponse.ok("Event proposal rejected.", rejected));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        }
    }
}
