package com.backend.ecoally.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "quests")
@EntityListeners(AuditingEntityListener.class)
public class Quest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String emoji;

    @Enumerated(EnumType.STRING)
    private QuestType type;

    @Enumerated(EnumType.STRING)
    private QuestAction action;

    private int target;
    private int points;
    private int coins;
    private String color;
    private boolean isActive = true;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum QuestType {
        DAILY, WEEKLY, EPIC
    }

    public enum QuestAction {
        COMPLETE_QUIZ, COMPLETE_CHALLENGE, MAINTAIN_STREAK
    }
}
