package com.backend.ecoally.kafka;

import com.backend.ecoally.events.ChallengeSubmissionEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "kafka.enabled", havingValue = "true")
public class ChallengeSubmissionProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishSubmission(ChallengeSubmissionEvent event) {
        kafkaTemplate.send("challenge-submissions",
                event.getStudentId().toString(),
                event);
        log.info("[Kafka] Published challenge-submission event: submissionId={}, studentId={}",
                event.getSubmissionId(), event.getStudentId());
    }
}
