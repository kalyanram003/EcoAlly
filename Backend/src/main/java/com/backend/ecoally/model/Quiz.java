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
@Document(collection = "quizzes")
public class Quiz {

    @Id
    private String id;

    private String title;
    private String description;
    private String topic;
    private Difficulty difficulty;
    private int timeLimit = 600;
    private boolean isPublished = false;
    private String createdBy; // User ID

    private List<Question> questions;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum Difficulty {
        EASY, MEDIUM, HARD
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Question {
        private String id;
        private String text;
        private List<String> options;
        private int correctAnswer; // 0-3
        private String explanation;
        private int order;
    }
}
