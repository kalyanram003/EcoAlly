package com.backend.ecoally.repository;

import com.backend.ecoally.model.QuestProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface QuestProgressRepository extends JpaRepository<QuestProgress, Long> {
        List<QuestProgress> findByStudentId(Long studentId);

        Optional<QuestProgress> findByStudentIdAndQuestIdAndPeriodStart(
                        Long studentId, Long questId, LocalDateTime periodStart);

        Optional<QuestProgress> findByStudentIdAndQuestIdAndPeriodStartAndPeriodEnd(
                        Long studentId, Long questId, LocalDateTime periodStart, LocalDateTime periodEnd);

        List<QuestProgress> findByStudentIdAndPeriodStartLessThanEqualAndPeriodEndGreaterThanEqual(
                        Long studentId, LocalDateTime date1, LocalDateTime date2);
}
