package com.ecolearn.repository;

import com.ecolearn.model.QuestProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDateTime;
import java.util.Optional;

public interface QuestProgressRepository extends MongoRepository<QuestProgress, String> {
    Optional<QuestProgress> findByStudentIdAndQuestIdAndPeriodStart(
            String studentId, String questId, LocalDateTime periodStart);

    Optional<QuestProgress> findByStudentIdAndQuestIdAndPeriodStartAndPeriodEnd(
            String studentId, String questId, LocalDateTime periodStart, LocalDateTime periodEnd);
}
