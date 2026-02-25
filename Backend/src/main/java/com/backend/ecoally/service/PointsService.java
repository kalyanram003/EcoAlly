package com.backend.ecoally.service;

import com.backend.ecoally.exception.AppException;
import com.backend.ecoally.model.Student;
import com.backend.ecoally.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PointsService {

    private static final int POINTS_PER_LEVEL = 100;

    private final StudentRepository studentRepository;

    public int calculateLevel(int points) {
        return (points / POINTS_PER_LEVEL) + 1;
    }

    public String calculateTier(int points) {
        if (points >= 10000)
            return "legend";
        if (points >= 5000)
            return "master";
        if (points >= 2000)
            return "guardian";
        if (points >= 500)
            return "explorer";
        return "sprout";
    }

    public Map<String, Object> addPoints(Long studentId, int points, int coins) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> AppException.notFound("Student not found"));

        student.setPoints(student.getPoints() + points);
        student.setCoins(student.getCoins() + coins);
        student.setLevel(calculateLevel(student.getPoints()));
        student.setTier(calculateTier(student.getPoints()));

        studentRepository.save(student);

        Map<String, Object> result = new HashMap<>();
        result.put("points", student.getPoints());
        result.put("coins", student.getCoins());
        result.put("level", student.getLevel());
        result.put("tier", student.getTier());
        result.put("pointsAdded", points);
        result.put("coinsAdded", coins);
        return result;
    }

    public Map<String, Integer> calculateQuizRewards(String difficulty, int score) {
        Map<String, Integer> basePoints = Map.of("EASY", 50, "MEDIUM", 100, "HARD", 150);
        Map<String, Integer> baseCoins = Map.of("EASY", 10, "MEDIUM", 20, "HARD", 30);

        double multiplier = score / 100.0;
        int points = (int) (basePoints.getOrDefault(difficulty, 50) * multiplier);
        int coins = (int) (baseCoins.getOrDefault(difficulty, 10) * multiplier);

        // Perfect score bonus
        if (score == 100) {
            points += 50;
            coins += 10;
        }

        return Map.of("points", points, "coins", coins);
    }

    public Map<String, Object> awardChallengePoints(Long studentId, int points) {
        int coins = points / 5;
        return addPoints(studentId, points, coins);
    }
}
