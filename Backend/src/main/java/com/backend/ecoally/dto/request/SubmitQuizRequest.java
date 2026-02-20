package com.ecolearn.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Map;

@Data
public class SubmitQuizRequest {
    @NotNull
    private Map<String, Integer> answers; // questionId -> selectedOption (0-3)
    private Integer timeTaken;
}
