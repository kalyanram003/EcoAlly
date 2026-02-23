package com.backend.ecoally.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EcoLensService {

    // ML service URL — change to deployed URL in production
    private static final String ML_SERVICE_URL = "http://localhost:8000/analyze";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public Map<String, Object> analyzeImage(String imageUrl, Double geoLat, Double geoLng) {
        try {
            // Build request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("imageUrl", imageUrl);
            if (geoLat != null) requestBody.put("geoLat", geoLat);
            if (geoLng != null) requestBody.put("geoLng", geoLng);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                ML_SERVICE_URL, entity, String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode json = objectMapper.readTree(response.getBody());
                Map<String, Object> result = new HashMap<>();
                result.put("ecoScore", json.get("ecoScore").asDouble());
                result.put("detectedCategory", json.get("category").asText());
                result.put("detectedSpecies", json.has("detectedSpecies") && !json.get("detectedSpecies").isNull()
                    ? json.get("detectedSpecies").asText() : null);
                result.put("isNativeSpecies", json.has("isNativeSpecies") && !json.get("isNativeSpecies").isNull()
                    ? json.get("isNativeSpecies").asBoolean() : null);
                result.put("autoDecision", json.get("autoDecision").asText());
                result.put("autoDecisionReason", json.get("autoDecisionReason").asText());
                result.put("bonusMultiplier", json.get("bonusMultiplier").asDouble());
                return result;
            }

        } catch (Exception e) {
            // ML service is down — degrade gracefully, let teacher review manually
            System.err.println("[EcoLens] ML service unavailable: " + e.getMessage());
        }

        return null; // null = ML service unavailable, fall back to manual review
    }
}
