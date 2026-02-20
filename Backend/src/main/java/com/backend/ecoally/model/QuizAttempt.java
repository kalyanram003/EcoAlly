package com.ecolearn.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "quizattempts")
public class QuizAttempt {

    @Id
    private String id;

    private String studentId;
    private String quizId;

    private int score;
    private int totalQuestions;
    private int correctAnswers;
    private int pointsEarned;

    private Map<String, Integer> answers; // questionId -> selectedOption

    private Integer timeTaken;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
