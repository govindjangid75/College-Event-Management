package com.aryacollege.campussphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "clubs")
public class Club {

    @Id
    private String id;

    @Indexed(unique = true)
    private String slug;

    private String name;
    private String category;
    private String tagline;
    private String description;
    private String logoUrl;
    private String bannerUrl;
    private String facultyCoordinator;
    private List<String> studentLeads;
    private Treasury treasury;
    private int memberCount;
    private int eventsHostedCount;
    private Map<String, String> socialLinks;
    private String recruitmentStatus;
    private String meetingSchedule;
    private Instant createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Treasury {
        private double totalRevenue;
        private double availableBalance;
        private double pendingSettlement;
        private String payoutUpiId;
    }
}
