package com.backend.ecoally.controller;

import com.backend.ecoally.dto.response.ApiResponse;
import com.backend.ecoally.model.ChallengeSubmission;
import com.backend.ecoally.model.QuizAttempt;
import com.backend.ecoally.model.Student;
import com.backend.ecoally.model.User;
import com.backend.ecoally.repository.ChallengeSubmissionRepository;
import com.backend.ecoally.repository.QuizAttemptRepository;
import com.backend.ecoally.repository.StudentRepository;
import com.backend.ecoally.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teacher")
@PreAuthorize("hasRole('TEACHER')")
@RequiredArgsConstructor
public class TeacherController {

    private final StudentRepository studentRepository;
    private final ChallengeSubmissionRepository submissionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final UserRepository userRepository;

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOverview(
            @AuthenticationPrincipal User user) {

        long totalStudents = studentRepository.count();
        long pendingSubmissions = submissionRepository.countByStatus(
                ChallengeSubmission.SubmissionStatus.PENDING);
        long totalSubmissions = submissionRepository.count();
        long totalQuizAttempts = quizAttemptRepository.count();

        LocalDate today = LocalDate.now();
        long activeToday = studentRepository.countByLastActiveDateBetween(
                today.atStartOfDay(), today.plusDays(1).atStartOfDay());

        List<QuizAttempt> recentAttempts = quizAttemptRepository.findTop5ByOrderByCreatedAtDesc();
        List<ChallengeSubmission> recentSubmissions = submissionRepository.findTop5ByOrderByCreatedAtDesc();

        Map<String, Object> result = new HashMap<>();
        result.put("totalStudents", totalStudents);
        result.put("activeToday", activeToday);
        result.put("pendingSubmissions", pendingSubmissions);
        result.put("totalSubmissions", totalSubmissions);
        result.put("totalQuizAttempts", totalQuizAttempts);
        result.put("recentQuizAttempts", recentAttempts);
        result.put("recentChallengeSubmissions", recentSubmissions);

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllStudents(
            @AuthenticationPrincipal User user) {

        List<Student> students = studentRepository.findAllByOrderByPointsDesc();

        List<Map<String, Object>> result = students.stream().map(student -> {
            User u = userRepository.findById(student.getUserId()).orElse(null);
            long quizzesCompleted = quizAttemptRepository.countByStudentId(student.getId());
            long challengesCompleted = submissionRepository.countByStudentIdAndStatus(
                    student.getId(), ChallengeSubmission.SubmissionStatus.APPROVED);

            Map<String, Object> entry = new HashMap<>();
            entry.put("id", student.getId());
            entry.put("name", u != null ? u.getFullName() : "Unknown");
            entry.put("email", u != null ? u.getEmail() : "");
            entry.put("avatarUrl", u != null ? u.getAvatarUrl() : null);
            entry.put("points", student.getPoints());
            entry.put("currentStreak", student.getCurrentStreak());
            entry.put("longestStreak", student.getLongestStreak());
            entry.put("quizzesCompleted", quizzesCompleted);
            entry.put("challengesCompleted", challengesCompleted);
            entry.put("level", student.getLevel());
            entry.put("tier", student.getTier());
            entry.put("lastActive", student.getLastActiveDate());
            return entry;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
