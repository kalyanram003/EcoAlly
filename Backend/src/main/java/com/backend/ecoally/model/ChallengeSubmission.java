package com.backend.ecoally.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "challengesubmissions")
public class ChallengeSubmission {

    @Id
    private String id;

    private String studentId;
    private String challengeId;

    private SubmissionStatus status = SubmissionStatus.PENDING;
    private List<String> mediaUrls;
    private String notes;
    private int pointsEarned = 0;

    private LocalDateTime reviewedAt;
    private String reviewedBy; // Teacher ID
    private String reviewNotes;

    // ── EcoLens ML Fields (NEW) ───────────────────────────────────────────────
    private Double ecoScore;
    private String detectedCategory;
    private String detectedSpecies;
    private Boolean isNativeSpecies;
    private Double geoLat;
    private Double geoLng;
    private Double bonusMultiplier = 1.0;
    private String autoDecisionReason;
    private Boolean autoProcessed = false;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum SubmissionStatus {
        PENDING, APPROVED, REJECTED
    }
}
