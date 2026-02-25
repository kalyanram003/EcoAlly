package com.backend.ecoally.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "challenge_submissions")
@EntityListeners(AuditingEntityListener.class)
public class ChallengeSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;
    private Long challengeId;

    @Enumerated(EnumType.STRING)
    private SubmissionStatus status = SubmissionStatus.PENDING;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "submission_media_urls", joinColumns = @JoinColumn(name = "submission_id"))
    @Column(name = "url", columnDefinition = "TEXT")
    private List<String> mediaUrls;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private int pointsEarned = 0;
    private LocalDateTime reviewedAt;
    private Long reviewedBy;

    @Column(columnDefinition = "TEXT")
    private String reviewNotes;

    // EcoLens ML Fields
    private Double ecoScore;
    private String detectedCategory;
    private String detectedSpecies;
    private Boolean isNativeSpecies;
    private Double geoLat;
    private Double geoLng;
    private Double bonusMultiplier = 1.0;

    @Column(columnDefinition = "TEXT")
    private String autoDecisionReason;

    private Boolean autoProcessed = false;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum SubmissionStatus {
        PENDING, APPROVED, REJECTED
    }
}
