package com.aryacollege.campussphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class AiChatDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String query;
        private String userId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActionLink {
        private String label;
        private String url;
        private String type; // "EVENT" | "CLUB" | "TRANSCRIPT" | "PASS" | "VERIFY"
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String query;
        private String reply;
        private String intent;
        private List<ActionLink> actionLinks;
        private List<String> quickFollowUps;
    }
}
