package com.backend.ecoally.service;

import com.backend.ecoally.exception.AppException;
import com.backend.ecoally.model.Student;
import com.backend.ecoally.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StreakService {

    private final StudentRepository studentRepository;

    public Map<String, Object> updateStreak(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> AppException.notFound("Student not found"));

        LocalDateTime today = LocalDateTime.now();
        LocalDateTime lastActive = student.getLastActiveDate();

        Map<String, Object> result = new HashMap<>();

        if (lastActive == null) {
            // First time
            student.setCurrentStreak(1);
            student.setLongestStreak(1);
            student.setLastActiveDate(today);
            studentRepository.save(student);

            result.put("currentStreak", 1);
            result.put("longestStreak", 1);
            result.put("streakMaintained", true);
            result.put("streakBroken", false);
            return result;
        }

        LocalDate todayDate = today.toLocalDate();
        LocalDate lastDate = lastActive.toLocalDate();

        if (todayDate.equals(lastDate)) {
            // Already active today
            result.put("currentStreak", student.getCurrentStreak());
            result.put("longestStreak", student.getLongestStreak());
            result.put("streakMaintained", true);
            result.put("streakBroken", false);
            return result;
        }

        long daysBetween = ChronoUnit.DAYS.between(lastDate, todayDate);

        if (daysBetween == 1) {
            // Consecutive day
            student.setCurrentStreak(student.getCurrentStreak() + 1);
            if (student.getCurrentStreak() > student.getLongestStreak()) {
                student.setLongestStreak(student.getCurrentStreak());
            }
            student.setLastActiveDate(today);
            studentRepository.save(student);

            result.put("currentStreak", student.getCurrentStreak());
            result.put("longestStreak", student.getLongestStreak());
            result.put("streakMaintained", true);
            result.put("streakBroken", false);
        } else if (student.getStreakShields() > 0) {
            // Use shield
            student.setStreakShields(student.getStreakShields() - 1);
            student.setLastActiveDate(today);
            studentRepository.save(student);

            result.put("currentStreak", student.getCurrentStreak());
            result.put("longestStreak", student.getLongestStreak());
            result.put("streakMaintained", true);
            result.put("streakBroken", false);
            result.put("shieldUsed", true);
            result.put("shieldsRemaining", student.getStreakShields());
        } else {
            // Streak broken
            student.setCurrentStreak(1);
            student.setLastActiveDate(today);
            studentRepository.save(student);

            result.put("currentStreak", 1);
            result.put("longestStreak", student.getLongestStreak());
            result.put("streakMaintained", false);
            result.put("streakBroken", true);
        }

        return result;
    }
}
