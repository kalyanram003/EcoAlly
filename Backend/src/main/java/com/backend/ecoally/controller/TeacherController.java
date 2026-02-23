package com.backend.ecoally.controller;

import com.backend.ecoally.dto.response.ApiResponse;
import com.backend.ecoally.model.ChallengeSubmission;
import com.backend.ecoally.model.QuizAttempt;
import com.backend.ecoally.model.Student;
import com.backend.ecoally.model.User;
import com.backend.ecoally.repository.ChallengeRepository;
import com.backend.ecoally.repository.ChallengeSubmissionRepository;
import com.backend.ecoally.repository.QuizAttemptRepository;
import com.backend.ecoally.repository.QuizRepository;
import com.backend.ecoally.repository.StudentRepository;
import com.backend.ecoally.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    private final QuizRepository quizRepository;
    private final ChallengeRepository challengeRepository;

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

        // ── Enrich recent quiz attempts ─────────────────────────────────────────
        List<QuizAttempt> recentAttempts = quizAttemptRepository.findTop5ByOrderByCreatedAtDesc();
        List<Map<String, Object>> enrichedAttempts = recentAttempts.stream().map(attempt -> {
            Map<String, Object> entry = new java.util.HashMap<>();
            Student student = studentRepository.findById(attempt.getStudentId()).orElse(null);
            User u = student != null ? userRepository.findById(student.getUserId()).orElse(null) : null;
            entry.put("studentName", u != null ? u.getFullName() : "Student");
            var quiz = quizRepository.findById(attempt.getQuizId()).orElse(null);
            entry.put("quizTitle", quiz != null ? quiz.getTitle() : "Quiz");
            entry.put("pointsEarned", attempt.getPointsEarned());
            entry.put("score", attempt.getScore());
            entry.put("submittedAt", attempt.getCreatedAt());
            return entry;
        }).collect(java.util.stream.Collectors.toList());

        // ── Enrich recent challenge submissions ─────────────────────────────────
        List<ChallengeSubmission> recentSubmissions = submissionRepository.findTop5ByOrderByCreatedAtDesc();
        List<Map<String, Object>> enrichedSubmissions = recentSubmissions.stream().map(sub -> {
            Map<String, Object> entry = new java.util.HashMap<>();
            Student student = studentRepository.findById(sub.getStudentId()).orElse(null);
            User u = student != null ? userRepository.findById(student.getUserId()).orElse(null) : null;
            entry.put("studentName", u != null ? u.getFullName() : "Student");
            var challenge = challengeRepository.findById(sub.getChallengeId()).orElse(null);
            entry.put("challengeTitle", challenge != null ? challenge.getTitle() : "Challenge");
            entry.put("pointsEarned", sub.getPointsEarned());
            entry.put("status", sub.getStatus().toString());
            entry.put("submittedAt", sub.getCreatedAt());
            return entry;
        }).collect(java.util.stream.Collectors.toList());

        // ── Top performers ───────────────────────────────────────────────────────
        List<Student> topStudents = studentRepository.findAllByOrderByPointsDesc();
        if (topStudents.size() > 5) topStudents = topStudents.subList(0, 5);
        List<Map<String, Object>> topPerformers = topStudents.stream().map(student -> {
            User u = userRepository.findById(student.getUserId()).orElse(null);
            Map<String, Object> entry = new java.util.HashMap<>();
            entry.put("name", u != null ? u.getFullName() : "Student");
            entry.put("points", student.getPoints());
            entry.put("currentStreak", student.getCurrentStreak());
            entry.put("avatarUrl", u != null ? u.getAvatarUrl() : null);
            entry.put("tier", student.getTier());
            return entry;
        }).collect(java.util.stream.Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("totalStudents", totalStudents);
        result.put("activeToday", activeToday);
        result.put("pendingSubmissions", pendingSubmissions);
        result.put("totalSubmissions", totalSubmissions);
        result.put("totalQuizAttempts", totalQuizAttempts);
        result.put("recentQuizAttempts", enrichedAttempts);
        result.put("recentChallengeSubmissions", enrichedSubmissions);
        result.put("topPerformers", topPerformers);

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

    @GetMapping("/quizzes")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMyQuizzes(
            @AuthenticationPrincipal User user) {
        List<com.backend.ecoally.model.Quiz> quizzes =
                quizRepository.findByCreatedByOrderByCreatedAtDesc(user.getId());
        List<Map<String, Object>> result = quizzes.stream().map(q -> {
            Map<String, Object> entry = new java.util.HashMap<>();
            entry.put("id", q.getId());
            entry.put("title", q.getTitle());
            entry.put("description", q.getDescription());
            entry.put("topic", q.getTopic());
            entry.put("difficulty", q.getDifficulty());
            entry.put("questionCount", q.getQuestions() != null ? q.getQuestions().size() : 0);
            entry.put("isPublished", q.isPublished());
            entry.put("createdAt", q.getCreatedAt());
            long attempts = quizAttemptRepository.countByQuizId(q.getId());
            entry.put("totalAttempts", attempts);
            return entry;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/challenges")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMyChallenges(
            @AuthenticationPrincipal User user) {
        List<com.backend.ecoally.model.Challenge> challenges =
                challengeRepository.findByCreatedByOrderByCreatedAtDesc(user.getId());
        List<Map<String, Object>> result = challenges.stream().map(c -> {
            Map<String, Object> entry = new java.util.HashMap<>();
            entry.put("id", c.getId());
            entry.put("title", c.getTitle());
            entry.put("description", c.getDescription());
            entry.put("type", c.getType());
            entry.put("difficulty", c.getDifficulty());
            entry.put("points", c.getPoints());
            entry.put("isPublished", c.isPublished());
            entry.put("createdAt", c.getCreatedAt());
            long submissions = submissionRepository.countByChallengeId(c.getId());
            entry.put("totalSubmissions", submissions);
            return entry;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
