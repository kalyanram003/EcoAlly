package com.backend.ecoally.repository;

import com.backend.ecoally.model.QuestProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDateTime;
import java.util.Optional;

public interface QuestProgressRepository extends MongoRepository<QuestProgress, String> {
    Optional<QuestProgress> findByStudentIdAndQuestIdAndPeriodStart(
            String studentId, String questId, LocalDateTime periodStart);

    Optional<QuestProgress> findByStudentIdAndQuestIdAndPeriodStartAndPeriodEnd(
            String studentId, String questId, LocalDateTime periodStart, LocalDateTime periodEnd);
}
