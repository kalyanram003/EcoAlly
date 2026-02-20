package com.ecolearn.dto.request;

import com.ecolearn.model.Quiz;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class CreateQuizRequest {
    @NotBlank private String title;
    private String description;
    @NotBlank private String topic;
    @NotNull private Quiz.Difficulty difficulty;
    private int timeLimit = 600;
    private boolean isPublished = false;
    private List<Quiz.Question> questions;
}
