package com.aryacollege.campussphere.controller;

import com.aryacollege.campussphere.dto.AiChatDto;
import com.aryacollege.campussphere.dto.AiEventDraftDto;
import com.aryacollege.campussphere.dto.ApiResponse;
import com.aryacollege.campussphere.model.Event;
import com.aryacollege.campussphere.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiController {

    private final AiService aiService;

    /**
     * AI Copilot: Generates title, summary, markdown syllabus, recommended venue & activity points.
     */
    @PostMapping("/copilot/generate-event")
    public ResponseEntity<ApiResponse<AiEventDraftDto>> generateEventDraft(@RequestBody AiEventDraftDto request) {
        AiEventDraftDto response = aiService.generateEventDraft(request);
        return ResponseEntity.ok(ApiResponse.ok("AI event draft generated successfully!", response));
    }

    /**
     * Campus Concierge Chatbot: Context-aware Q&A in English/Hinglish with direct links.
     */
    @PostMapping("/concierge/chat")
    public ResponseEntity<ApiResponse<AiChatDto.Response>> handleConciergeChat(@RequestBody AiChatDto.Request request) {
        AiChatDto.Response response = aiService.handleConciergeChat(request);
        return ResponseEntity.ok(ApiResponse.ok("Concierge query processed", response));
    }

    /**
     * Personalized AI Event Recommender based on student profile & activity points portfolio.
     */
    @GetMapping("/recommendations/{userId}")
    public ResponseEntity<ApiResponse<List<Event>>> getRecommendations(@PathVariable String userId) {
        List<Event> recommended = aiService.getRecommendedEvents(userId);
        return ResponseEntity.ok(ApiResponse.ok("Personalized recommendations retrieved", recommended));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<Event>>> getGeneralRecommendations() {
        List<Event> recommended = aiService.getRecommendedEvents("general");
        return ResponseEntity.ok(ApiResponse.ok("General AI recommendations retrieved", recommended));
    }
}
