package com.backend.ecoally.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
@ConditionalOnProperty(name = "kafka.enabled", havingValue = "true")
public class KafkaConfig {

    @Bean
    public NewTopic challengeSubmissionTopic() {
        return TopicBuilder.name("challenge-submissions")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic pointsEarnedTopic() {
        return TopicBuilder.name("points-earned")
                .partitions(3)
                .replicas(1)
                .build();
    }
}
