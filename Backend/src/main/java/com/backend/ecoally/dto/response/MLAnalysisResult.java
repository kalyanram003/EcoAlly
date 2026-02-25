package com.backend.ecoally.dto.response;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class MLAnalysisResult {

    private boolean success;
    private String category;
    private double confidence;
    private int ecoScore;
    private String detectedSpecies;
    private Boolean isNativeSpecies;
    private String autoDecision;
    private String autoDecisionReason;
    private double bonusMultiplier;
    private Map<String, Integer> scoreBreakdown;
    private List<String> cheatFlags;
}

