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
@Document(collection = "quests")
public class Quest {

    @Id
    private String id;

    private String title;
    private String description;
    private String emoji;
    private QuestType type;        // DAILY, WEEKLY, EPIC
    private QuestAction action;    // COMPLETE_QUIZ, COMPLETE_CHALLENGE, MAINTAIN_STREAK
    private int target;            // goal number (e.g., 5 quizzes)
    private int points;            // XP reward
    private int coins;             // coin reward
    private String color;          // CSS class for UI
    private boolean isActive = true;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum QuestType { DAILY, WEEKLY, EPIC }

    public enum QuestAction { COMPLETE_QUIZ, COMPLETE_CHALLENGE, MAINTAIN_STREAK }
}
