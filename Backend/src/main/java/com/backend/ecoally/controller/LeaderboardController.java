package com.backend.ecoally.controller;

import com.backend.ecoally.dto.response.ApiResponse;
import com.backend.ecoally.model.ChallengeSubmission;
import com.backend.ecoally.model.Student;
import com.backend.ecoally.model.User;
import com.backend.ecoally.repository.ChallengeSubmissionRepository;
import com.backend.ecoally.repository.QuizAttemptRepository;
import com.backend.ecoally.repository.StudentRepository;
import com.backend.ecoally.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final ChallengeSubmissionRepository submissionRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getLeaderboard(
            @RequestParam(defaultValue = "total") String category,
            @RequestParam(defaultValue = "20") int limit,
            @AuthenticationPrincipal User currentUser) {
        List<Student> students = studentRepository.findAllByOrderByPointsDesc();
        if (students.size() > limit) {
            students = students.subList(0, limit);
        }
        Long currentStudentId = null;
        Student currentStudentRecord = null;
        if (currentUser != null) {
            currentStudentRecord = studentRepository.findByUserId(currentUser.getId()).orElse(null);
            if (currentStudentRecord != null) {
                currentStudentId = currentStudentRecord.getId();
            }
        }
        final Long finalCurrentStudentId = currentStudentId;
        final Student finalCurrentStudentRecord = currentStudentRecord;
        int[] rank = { 1 };
        List<Map<String, Object>> entries = students.stream().map(student -> {
            User u = userRepository.findById(student.getUserId()).orElse(null);
            long quizzesCompleted = quizAttemptRepository.countByStudentId(student.getId());
            long challengesCompleted = submissionRepository.countByStudentIdAndStatus(
                    student.getId(), ChallengeSubmission.SubmissionStatus.APPROVED);

            Map<String, Object> entry = new HashMap<>();
            entry.put("id", student.getId());
            entry.put("name", u != null ? u.getFullName() : "Unknown");
            entry.put("username", u != null ? u.getUsername() : "");
            entry.put("avatarUrl", u != null ? u.getAvatarUrl() : null);
            entry.put("points", student.getPoints());
            entry.put("streak", student.getCurrentStreak());
            entry.put("quizzesCompleted", quizzesCompleted);
            entry.put("challengesCompleted", challengesCompleted);
            entry.put("rank", rank[0]++);
            entry.put("isCurrentUser", student.getId().equals(finalCurrentStudentId));
            return entry;
        }).collect(Collectors.toList());

        Map<String, Object> myRank = null;
        if (finalCurrentStudentId != null) {
            boolean foundInTop = entries.stream()
                    .anyMatch(e -> Boolean.TRUE.equals(e.get("isCurrentUser")));
            if (!foundInTop && finalCurrentStudentRecord != null) {
                long myRankNum = studentRepository.countByPointsGreaterThan(
                        finalCurrentStudentRecord.getPoints()) + 1;
                myRank = new HashMap<>();
                myRank.put("rank", myRankNum);
                myRank.put("points", finalCurrentStudentRecord.getPoints());
                myRank.put("name", currentUser.getFullName());
                myRank.put("avatarUrl", currentUser.getAvatarUrl());
                myRank.put("isCurrentUser", true);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("entries", entries);
        result.put("myRank", myRank);
        result.put("total", studentRepository.count());
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
