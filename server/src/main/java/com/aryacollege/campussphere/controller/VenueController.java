package com.aryacollege.campussphere.controller;

import com.aryacollege.campussphere.dto.ApiResponse;
import com.aryacollege.campussphere.dto.VenueClashCheckDto;
import com.aryacollege.campussphere.dto.VenueClashResultDto;
import com.aryacollege.campussphere.model.Venue;
import com.aryacollege.campussphere.repository.VenueRepository;
import com.aryacollege.campussphere.service.VenueClashEngineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueRepository venueRepository;
    private final VenueClashEngineService venueClashEngineService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Venue>>> getAllVenues() {
        List<Venue> venues = venueRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok("Institutional venues retrieved", venues));
    }

    /**
     * Real-time pre-check endpoint for event creation wizard:
     * Validates whether requested slot conflicts with existing events or buffer zones.
     */
    @PostMapping("/check-clash")
    public ResponseEntity<ApiResponse<VenueClashResultDto>> checkClash(@Valid @RequestBody VenueClashCheckDto dto) {
        VenueClashResultDto result = venueClashEngineService.checkVenueCollision(dto);
        return ResponseEntity.ok(ApiResponse.ok(
            result.isClash() ? "Venue Collision Warning!" : "Venue Available",
            result
        ));
    }
}
