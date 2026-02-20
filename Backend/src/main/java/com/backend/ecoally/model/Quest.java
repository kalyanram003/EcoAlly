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

    private QuestType type;
    private String title;
    private String description;
    private String emoji;
    private int maxProgress;
    private int points;
    private List<String> requirements;
    private String color;
    private boolean isActive = true;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum QuestType {
        DAILY, WEEKLY, EPIC
    }
}
