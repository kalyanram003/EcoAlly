package com.backend.ecoally.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChallengeSubmissionEvent {
    private Long submissionId;
    private Long studentId;
    private Long challengeId;
    private List<String> mediaUrls; // all uploaded Cloudinary URLs
    private String primaryImageUrl; // mediaUrls.get(0) — the one sent to ML
    private Double geoLat;
    private Double geoLng;
    private Integer challengeBasePoints;
    private LocalDateTime submittedAt;
}
