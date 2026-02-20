package com.backend.ecoally.controller;

import com.backend.ecoally.dto.request.CreateQuizRequest;
import com.backend.ecoally.dto.request.SubmitQuizRequest;
import com.backend.ecoally.dto.response.ApiResponse;
import com.backend.ecoally.exception.AppException;
import com.backend.ecoally.model.*;
import com.backend.ecoally.repository.QuizAttemptRepository;
import com.backend.ecoally.repository.QuizRepository;
import com.backend.ecoally.repository.StudentRepository;
import com.backend.ecoally.service.PointsService;
import com.backend.ecoally.service.QuestService;
import com.backend.ecoally.service.StreakService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final StudentRepository studentRepository;
    private final PointsService pointsService;
    private final StreakService streakService;
    private final QuestService questService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Quiz>>> getAllQuizzes(
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String difficulty) {

        List<Quiz> quizzes;

        if (topic != null && difficulty != null) {
            quizzes = quizRepository.findByIsPublishedTrueAndTopicAndDifficultyOrderByCreatedAtDesc(
                    topic, Quiz.Difficulty.valueOf(difficulty));
        } else if (topic != null) {
            quizzes = quizRepository.findByIsPublishedTrueAndTopicOrderByCreatedAtDesc(topic);
        } else if (difficulty != null) {
            quizzes = quizRepository.findByIsPublishedTrueAndDifficultyOrderByCreatedAtDesc(
                    Quiz.Difficulty.valueOf(difficulty));
        } else {
            quizzes = quizRepository.findByIsPublishedTrueOrderByCreatedAtDesc();
        }

        // Remove correct answers for returned list
        quizzes.forEach(q -> {
            if (q.getQuestions() != null) {
                q.getQuestions().forEach(question -> {
                    question.setCorrectAnswer(-1);
                    question.setExplanation(null);
                });
            }
        });

        return ResponseEntity.ok(ApiResponse.success(quizzes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Quiz>> getQuizById(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Quiz not found"));

        if (user.getUserType() == User.UserType.STUDENT) {
            // Sanitize for students
            quiz.getQuestions().forEach(q -> {
                q.setCorrectAnswer(-1);
                q.setExplanation(null);
            });
        }

        return ResponseEntity.ok(ApiResponse.success(quiz));
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Quiz>> createQuiz(
            @Valid @RequestBody CreateQuizRequest request,
            @AuthenticationPrincipal User user) {
        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setTopic(request.getTopic());
        quiz.setDifficulty(request.getDifficulty());
        quiz.setTimeLimit(request.getTimeLimit());
        quiz.setPublished(request.isPublished());
        quiz.setCreatedBy(user.getId());

        // Assign IDs to questions
        if (request.getQuestions() != null) {
            request.getQuestions().forEach(q -> {
                if (q.getId() == null) q.setId(UUID.randomUUID().toString());
            });
            quiz.setQuestions(request.getQuestions());
        }

        Quiz saved = quizRepository.save(quiz);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Quiz>> updateQuiz(
            @PathVariable String id,
            @RequestBody CreateQuizRequest request,
            @AuthenticationPrincipal User user) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Quiz not found"));

        if (!quiz.getCreatedBy().equals(user.getId())) {
            throw AppException.forbidden("Not authorized to update this quiz");
        }

        if (request.getTitle() != null) quiz.setTitle(request.getTitle());
        if (request.getDescription() != null) quiz.setDescription(request.getDescription());
        if (request.getTopic() != null) quiz.setTopic(request.getTopic());
        if (request.getDifficulty() != null) quiz.setDifficulty(request.getDifficulty());
        quiz.setTimeLimit(request.getTimeLimit());
        quiz.setPublished(request.isPublished());
        if (request.getQuestions() != null) quiz.setQuestions(request.getQuestions());

        Quiz updated = quizRepository.save(quiz);
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Void>> deleteQuiz(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Quiz not found"));

        if (!quiz.getCreatedBy().equals(user.getId())) {
            throw AppException.forbidden("Not authorized to delete this quiz");
        }

        quizRepository.delete(quiz);
        return ResponseEntity.ok(ApiResponse.success("Quiz deleted successfully", null));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitQuiz(
            @PathVariable String id,
            @RequestBody SubmitQuizRequest request,
            @AuthenticationPrincipal User user) {

        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Quiz not found"));

        if (!quiz.isPublished()) {
            throw AppException.badRequest("Quiz is not published");
        }

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> AppException.notFound("Student profile not found"));

        // Calculate score
        int correctAnswers = 0;
        for (Quiz.Question question : quiz.getQuestions()) {
            Integer userAnswer = request.getAnswers().get(question.getId());
            if (userAnswer != null && userAnswer == question.getCorrectAnswer()) {
                correctAnswers++;
            }
        }

        int totalQuestions = quiz.getQuestions().size();
        int score = totalQuestions > 0 ? Math.round((float) correctAnswers / totalQuestions * 100) : 0;

        Map<String, Integer> rewards = pointsService.calculateQuizRewards(
                quiz.getDifficulty().name(), score);

        // Save attempt
        QuizAttempt attempt = new QuizAttempt();
        attempt.setStudentId(student.getId());
        attempt.setQuizId(quiz.getId());
        attempt.setScore(score);
        attempt.setTotalQuestions(totalQuestions);
        attempt.setCorrectAnswers(correctAnswers);
        attempt.setPointsEarned(rewards.get("points"));
        attempt.setAnswers(request.getAnswers());
        attempt.setTimeTaken(request.getTimeTaken());
        quizAttemptRepository.save(attempt);

        // Award points
        Map<String, Object> pointsUpdate = pointsService.addPoints(
                student.getId(), rewards.get("points"), rewards.get("coins"));

        // Update streak
        Map<String, Object> streakUpdate = streakService.updateStreak(student.getId());

        // Update quests
        questService.updateQuestProgress(student.getId(), Quest.QuestType.DAILY, 1);
        questService.updateQuestProgress(student.getId(), Quest.QuestType.WEEKLY, 1);

        // Build detailed results
        List<Map<String, Object>> questionResults = quiz.getQuestions().stream().map(q -> {
            Map<String, Object> qResult = new HashMap<>();
            qResult.put("_id", q.getId());
            qResult.put("text", q.getText());
            qResult.put("options", q.getOptions());
            qResult.put("correctAnswer", q.getCorrectAnswer());
            qResult.put("explanation", q.getExplanation());
            qResult.put("userAnswer", request.getAnswers().get(q.getId()));
            qResult.put("isCorrect", request.getAnswers().getOrDefault(q.getId(), -1) == q.getCorrectAnswer());
            return qResult;
        }).collect(Collectors.toList());

        Map<String, Object> attemptSummary = new HashMap<>();
        attemptSummary.put("_id", attempt.getId());
        attemptSummary.put("score", score);
        attemptSummary.put("correctAnswers", correctAnswers);
        attemptSummary.put("totalQuestions", totalQuestions);
        attemptSummary.put("pointsEarned", rewards.get("points"));
        attemptSummary.put("coinsEarned", rewards.get("coins"));

        Map<String, Object> gamification = new HashMap<>();
        gamification.putAll(pointsUpdate);
        gamification.putAll(streakUpdate);

        Map<String, Object> result = new HashMap<>();
        result.put("attempt", attemptSummary);
        result.put("gamification", gamification);
        result.put("questions", questionResults);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(result));
    }

    @GetMapping("/my/attempts")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<QuizAttempt>>> getMyAttempts(
            @AuthenticationPrincipal User user) {
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> AppException.notFound("Student profile not found"));

        List<QuizAttempt> attempts = quizAttemptRepository.findByStudentIdOrderByCreatedAtDesc(student.getId());
        return ResponseEntity.ok(ApiResponse.success(attempts));
    }
}
