package com.backend.ecoally.kafka;

import com.backend.ecoally.events.ChallengeSubmissionEvent;
import com.backend.ecoally.model.ChallengeSubmission;
import com.backend.ecoally.dto.response.MLAnalysisResult;
import com.backend.ecoally.repository.ChallengeSubmissionRepository;
import com.backend.ecoally.service.EcoLensService;
import com.backend.ecoally.service.PointsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "kafka.enabled", havingValue = "true")
public class ChallengeSubmissionConsumer {

    private final EcoLensService ecoLensService;
    private final PointsService pointsService;
    private final ChallengeSubmissionRepository submissionRepository;

    @KafkaListener(topics = "challenge-submissions", groupId = "ecoally-backend")
    public void processSubmission(ChallengeSubmissionEvent event) {
        log.info("[Kafka Consumer] Processing submissionId={}", event.getSubmissionId());

        ChallengeSubmission submission = submissionRepository
                .findById(event.getSubmissionId())
                .orElse(null);

        if (submission == null) {
            log.error("[Kafka Consumer] Submission {} not found — skipping", event.getSubmissionId());
            return;
        }

        try {
            // This call takes 3-10s — nobody is waiting for it now
            MLAnalysisResult mlResult = ecoLensService.analyzeImage(
                    event.getPrimaryImageUrl(),
                    event.getGeoLat(),
                    event.getGeoLng(),
                    event.getStudentId().toString(),
                    event.getChallengeId().toString());

            if (mlResult != null && mlResult.isSuccess()) {
                submission.setEcoScore((double) mlResult.getEcoScore());
                submission.setDetectedCategory(mlResult.getCategory());
                submission.setDetectedSpecies(mlResult.getDetectedSpecies());
                submission.setIsNativeSpecies(mlResult.getIsNativeSpecies());
                submission.setBonusMultiplier(mlResult.getBonusMultiplier());
                submission.setAutoDecisionReason(mlResult.getAutoDecisionReason());
                submission.setAutoProcessed(true);

                String decision = mlResult.getAutoDecision();

                if ("AUTO_APPROVED".equals(decision)) {
                    submission.setStatus(ChallengeSubmission.SubmissionStatus.APPROVED);
                    int basePoints = event.getChallengeBasePoints();
                    int finalPoints = (int) (basePoints * mlResult.getBonusMultiplier());
                    submission.setPointsEarned(finalPoints);
                    pointsService.awardChallengePoints(event.getStudentId(), finalPoints);
                    log.info("[Kafka Consumer] AUTO_APPROVED submissionId={}, points={}",
                            event.getSubmissionId(), finalPoints);

                } else if ("AUTO_REJECTED".equals(decision)) {
                    submission.setStatus(ChallengeSubmission.SubmissionStatus.REJECTED);
                    log.info("[Kafka Consumer] AUTO_REJECTED submissionId={}", event.getSubmissionId());

                } else {
                    // NEEDS_REVIEW — back to PENDING for teacher
                    submission.setStatus(ChallengeSubmission.SubmissionStatus.PENDING);
                    log.info("[Kafka Consumer] Moved to PENDING (manual review) submissionId={}",
                            event.getSubmissionId());
                }
            } else {
                // ML service down or returned failure — fall back to manual review
                submission.setStatus(ChallengeSubmission.SubmissionStatus.PENDING);
                log.warn("[Kafka Consumer] ML unavailable for submissionId={} — set to PENDING",
                        event.getSubmissionId());
            }

        } catch (Exception e) {
            // Don't leave submission stuck in PROCESSING
            submission.setStatus(ChallengeSubmission.SubmissionStatus.PENDING);
            log.error("[Kafka Consumer] Error processing submissionId={}: {}",
                    event.getSubmissionId(), e.getMessage(), e);
        }

        submissionRepository.save(submission);
    }
}
