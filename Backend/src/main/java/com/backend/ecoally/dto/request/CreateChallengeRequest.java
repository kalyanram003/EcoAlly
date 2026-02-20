package com.backend.ecoally.dto.request;

import com.backend.ecoally.model.Challenge;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class CreateChallengeRequest {
    @NotBlank private String title;
    @NotBlank private String description;
    @NotNull private Integer points;
    @NotNull private Challenge.Difficulty difficulty;
    @NotNull private Challenge.ChallengeType type;
    private String duration;
    private String icon;
    private String color;
    private List<String> requirements;
    private List<String> tips;
    private String learningTopic;
    private Challenge.GameConfig gameConfig;
    private boolean isPublished = false;
}
