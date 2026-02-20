package com.ecolearn.service;

import com.ecolearn.exception.AppException;
import com.ecolearn.model.Quest;
import com.ecolearn.model.QuestProgress;
import com.ecolearn.repository.QuestProgressRepository;
import com.ecolearn.repository.QuestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Service
@RequiredArgsConstructor
public class QuestService {

    private final QuestRepository questRepository;
    private final QuestProgressRepository questProgressRepository;
    private final PointsService pointsService;

    private LocalDateTime[] getPeriodBoundaries(Quest.QuestType type) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start, end;

        switch (type) {
            case DAILY -> {
                LocalDate today = now.toLocalDate();
                start = today.atStartOfDay();
                end = today.atTime(23, 59, 59);
            }
            case WEEKLY -> {
                LocalDate monday = now.toLocalDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
                start = monday.atStartOfDay();
                end = monday.plusDays(6).atTime(23, 59, 59);
            }
            default -> {
                start = LocalDateTime.of(1970, 1, 1, 0, 0);
                end = LocalDateTime.of(2099, 12, 31, 23, 59, 59);
            }
        }

        return new LocalDateTime[]{start, end};
    }

    public List<Map<String, Object>> getActiveQuests(String studentId) {
        List<Quest> quests = questRepository.findByIsActiveTrue();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Quest quest : quests) {
            LocalDateTime[] period = getPeriodBoundaries(quest.getType());
            LocalDateTime periodStart = period[0];
            LocalDateTime periodEnd = period[1];

            QuestProgress progress = questProgressRepository
                    .findByStudentIdAndQuestIdAndPeriodStartAndPeriodEnd(
                            studentId, quest.getId(), periodStart, periodEnd)
                    .orElseGet(() -> {
                        QuestProgress p = new QuestProgress();
                        p.setStudentId(studentId);
                        p.setQuestId(quest.getId());
                        p.setProgress(0);
                        p.setPeriodStart(periodStart);
                        p.setPeriodEnd(periodEnd);
                        return questProgressRepository.save(p);
                    });

            Map<String, Object> entry = new HashMap<>();
            entry.put("quest", quest);
            entry.put("progress", progress);
            result.add(entry);
        }

        return result;
    }

    public void updateQuestProgress(String studentId, Quest.QuestType questType, int increment) {
        List<Quest> quests = questRepository.findByTypeAndIsActiveTrue(questType);
        LocalDateTime[] period = getPeriodBoundaries(questType);

        for (Quest quest : quests) {
            QuestProgress progress = questProgressRepository
                    .findByStudentIdAndQuestIdAndPeriodStartAndPeriodEnd(
                            studentId, quest.getId(), period[0], period[1])
                    .orElseGet(() -> {
                        QuestProgress p = new QuestProgress();
                        p.setStudentId(studentId);
                        p.setQuestId(quest.getId());
                        p.setProgress(0);
                        p.setPeriodStart(period[0]);
                        p.setPeriodEnd(period[1]);
                        return p;
                    });

            if (!progress.isCompleted()) {
                int newProgress = Math.min(progress.getProgress() + increment, quest.getMaxProgress());
                progress.setProgress(newProgress);
                if (newProgress >= quest.getMaxProgress()) {
                    progress.setCompleted(true);
                    progress.setCompletedAt(LocalDateTime.now());
                }
                questProgressRepository.save(progress);
            }
        }
    }

    public Map<String, Object> claimQuestReward(String studentId, String questId) {
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> AppException.notFound("Quest not found"));

        LocalDateTime[] period = getPeriodBoundaries(quest.getType());

        QuestProgress progress = questProgressRepository
                .findByStudentIdAndQuestIdAndPeriodStartAndPeriodEnd(
                        studentId, questId, period[0], period[1])
                .orElseThrow(() -> AppException.notFound("Quest progress not found"));

        if (!progress.isCompleted()) {
            throw AppException.badRequest("Quest is not completed yet");
        }

        Map<String, Object> reward = pointsService.addPoints(studentId, quest.getPoints(), 0);

        Map<String, Object> result = new HashMap<>();
        result.put("quest", quest);
        result.put("progress", progress);
        result.put("reward", reward);
        return result;
    }
}
