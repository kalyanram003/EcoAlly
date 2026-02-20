package com.backend.ecoally.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Map;

@Data
public class SubmitQuizRequest {
    @NotNull
    private Map<String, Integer> answers; 
    private Integer timeTaken;
}
