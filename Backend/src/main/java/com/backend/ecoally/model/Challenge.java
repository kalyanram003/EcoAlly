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
@Document(collection = "challenges")
public class Challenge {

    @Id
    private String id;

    private String title;
    private String description;
    private int points;
    private Difficulty difficulty;
    private ChallengeType type;
    private String duration;
    private String icon;
    private String color;
    private List<String> requirements;
    private List<String> tips;
    private String learningTopic;
    private GameConfig gameConfig;
    private boolean isPublished = false;
    private String createdBy; // User ID

    @CreatedDate
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
    public static class GameConfig {
        private String gameType;
        private Integer timeLimit;
        private Integer minScore;
    }
}
