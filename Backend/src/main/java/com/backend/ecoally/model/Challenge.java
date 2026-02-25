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
@Table(name = "challenges")
@EntityListeners(AuditingEntityListener.class)
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private int points;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Enumerated(EnumType.STRING)
    private ChallengeType type;

    private String duration;
    private String icon;
    private String color;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "challenge_requirements", joinColumns = @JoinColumn(name = "challenge_id"))
    @Column(name = "requirement", columnDefinition = "TEXT")
    private List<String> requirements;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "challenge_tips", joinColumns = @JoinColumn(name = "challenge_id"))
    @Column(name = "tip", columnDefinition = "TEXT")
    private List<String> tips;

    private String learningTopic;

    @Embedded
    private GameConfig gameConfig;

    private boolean isPublished = false;

    private Long createdBy; // User ID

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum Difficulty {
        EASY, MEDIUM, HARD
    }

    public enum ChallengeType {
        PHOTO, ACTION, SOCIAL, LEARNING, GAME
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class GameConfig {
        private String gameType;
        private Integer timeLimit;
        private Integer minScore;
    }
}
