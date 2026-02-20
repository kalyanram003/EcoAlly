package com.ecolearn.model;

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

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum SubmissionStatus {
        PENDING, APPROVED, REJECTED
    }
}
