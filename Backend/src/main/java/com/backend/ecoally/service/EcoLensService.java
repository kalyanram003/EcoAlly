package com.backend.ecoally.service;

import com.backend.ecoally.dto.response.MLAnalysisResult;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EcoLensService {

    private static final Logger log = LoggerFactory.getLogger(EcoLensService.class);

    @Value("${ml.service.url:http://localhost:5000}")
    private String mlServiceUrl;

    private final RestTemplate restTemplate;

    public MLAnalysisResult analyzeImage(
            String imageUrl,
            Double geoLat,
            Double geoLng,
            String studentId,
            String challengeId
    ) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("imageUrl", imageUrl);
            if (geoLat != null) requestBody.put("geoLat", geoLat);
            if (geoLng != null) requestBody.put("geoLng", geoLng);
            if (studentId != null) requestBody.put("studentId", studentId);
            if (challengeId != null) requestBody.put("challengeId", challengeId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            String url = mlServiceUrl.endsWith("/")
                    ? mlServiceUrl + "analyze"
                    : mlServiceUrl + "/analyze";

            ResponseEntity<MLAnalysisResult> response = restTemplate.postForEntity(
                    url,
                    entity,
                    MLAnalysisResult.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                MLAnalysisResult body = response.getBody();
                if (body.isSuccess()) {
                    return body;
                }
                log.warn("[EcoLens] ML service responded with success=false: {}", body.getAutoDecisionReason());
            } else {
                log.warn("[EcoLens] ML service returned non-2xx status: {}", response.getStatusCode());
            }

        } catch (Exception e) {
            // ML service is down — degrade gracefully, let teacher review manually
            log.error("[EcoLens] ML service unavailable: {}", e.getMessage(), e);
        }

        // null = ML service unavailable or unsuccessful, fall back to manual review
        return null;
    }
}

