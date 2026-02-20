package com.ecolearn.controller;

import com.ecolearn.dto.request.CreateChallengeRequest;
import com.ecolearn.dto.request.ReviewSubmissionRequest;
import com.ecolearn.dto.response.ApiResponse;
import com.ecolearn.exception.AppException;
import com.ecolearn.model.*;
import com.ecolearn.repository.*;
import com.ecolearn.service.PointsService;
import com.ecolearn.service.StorageService;
import com.ecolearn.service.StreakService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
public class ChallengeController {

    private final ChallengeRepository challengeRepository;
    private final ChallengeSubmissionRepository submissionRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final StorageService storageService;
    private final PointsService pointsService;
    private final StreakService streakService;

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Challenge>> createChallenge(
            @Valid @RequestBody CreateChallengeRequest request,
            @AuthenticationPrincipal User user) {
        Challenge challenge = new Challenge();
        challenge.setTitle(request.getTitle());
        challenge.setDescription(request.getDescription());
        challenge.setPoints(request.getPoints());
        challenge.setDifficulty(request.getDifficulty());
        challenge.setType(request.getType());
        challenge.setDuration(request.getDuration());
        challenge.setIcon(request.getIcon());
        challenge.setColor(request.getColor());
        challenge.setRequirements(request.getRequirements());
        challenge.setTips(request.getTips());
        challenge.setLearningTopic(request.getLearningTopic());
        challenge.setGameConfig(request.getGameConfig());
        challenge.setPublished(request.isPublished());
        challenge.setCreatedBy(user.getId());

        Challenge saved = challengeRepository.save(challenge);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(saved));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Challenge>>> getAllChallenges(
            @AuthenticationPrincipal User user) {
        List<Challenge> challenges;
        if (user.getUserType() == User.UserType.STUDENT) {
            challenges = challengeRepository.findByIsPublishedTrueOrderByCreatedAtDesc();
        } else {
            challenges = challengeRepository.findAllByOrderByCreatedAtDesc();
        }
        return ResponseEntity.ok(ApiResponse.success(challenges));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Challenge>> getChallengeById(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Challenge not found"));

        if (user.getUserType() == User.UserType.STUDENT && !challenge.isPublished()) {
            throw AppException.forbidden("Access denied");
        }

        return ResponseEntity.ok(ApiResponse.success(challenge));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Challenge>> updateChallenge(
            @PathVariable String id,
            @RequestBody CreateChallengeRequest request,
            @AuthenticationPrincipal User user) {
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Challenge not found"));

        if (!challenge.getCreatedBy().equals(user.getId())) {
            throw AppException.forbidden("Access denied");
        }

        if (request.getTitle() != null) challenge.setTitle(request.getTitle());
        if (request.getDescription() != null) challenge.setDescription(request.getDescription());
        if (request.getPoints() != null) challenge.setPoints(request.getPoints());
        if (request.getDifficulty() != null) challenge.setDifficulty(request.getDifficulty());
        if (request.getType() != null) challenge.setType(request.getType());
        if (request.getDuration() != null) challenge.setDuration(request.getDuration());
        challenge.setPublished(request.isPublished());

        Challenge updated = challengeRepository.save(challenge);
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteChallenge(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Challenge not found"));

        if (!challenge.getCreatedBy().equals(user.getId())) {
            throw AppException.forbidden("Access denied");
        }

        challengeRepository.delete(challenge);
        return ResponseEntity.ok(ApiResponse.success("Challenge deleted successfully", null));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<ChallengeSubmission>> submitChallenge(
            @PathVariable String id,
            @RequestParam(required = false) String notes,
            @RequestParam(required = false) List<MultipartFile> media,
            @AuthenticationPrincipal User user) throws IOException {

        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Challenge not found"));

        if (!challenge.isPublished()) {
            throw AppException.badRequest("Challenge is not published");
        }

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> AppException.notFound("Student profile not found"));

        List<String> mediaUrls = new ArrayList<>();
        if (media != null && !media.isEmpty()) {
            for (MultipartFile file : media) {
                String url = storageService.uploadImage(file, "challenges");
                mediaUrls.add(url);
            }
        }

        ChallengeSubmission submission = new ChallengeSubmission();
        submission.setStudentId(student.getId());
        submission.setChallengeId(challenge.getId());
        submission.setMediaUrls(mediaUrls);
        submission.setNotes(notes);

        ChallengeSubmission saved = submissionRepository.save(submission);

        // Update streak
        streakService.updateStreak(student.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(saved));
    }

    @GetMapping("/submissions/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<ChallengeSubmission>>> getMySubmissions(
            @AuthenticationPrincipal User user) {
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> AppException.notFound("Student profile not found"));

        List<ChallengeSubmission> submissions = submissionRepository
                .findByStudentIdOrderByCreatedAtDesc(student.getId());
        return ResponseEntity.ok(ApiResponse.success(submissions));
    }

    @GetMapping("/submissions/pending")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<ChallengeSubmission>>> getPendingSubmissions() {
        List<ChallengeSubmission> submissions = submissionRepository
                .findByStatusOrderByCreatedAtDesc(ChallengeSubmission.SubmissionStatus.PENDING);
        return ResponseEntity.ok(ApiResponse.success(submissions));
    }

    @PutMapping("/submissions/{id}/review")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<ChallengeSubmission>> reviewSubmission(
            @PathVariable String id,
            @Valid @RequestBody ReviewSubmissionRequest request,
            @AuthenticationPrincipal User user) {

        if (!List.of("APPROVED", "REJECTED").contains(request.getStatus())) {
            throw AppException.badRequest("Invalid status. Must be APPROVED or REJECTED");
        }

        ChallengeSubmission submission = submissionRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Submission not found"));

        if (submission.getStatus() != ChallengeSubmission.SubmissionStatus.PENDING) {
            throw AppException.badRequest("Submission has already been reviewed");
        }

        Teacher teacher = teacherRepository.findByUserId(user.getId())
                .orElseThrow(() -> AppException.notFound("Teacher profile not found"));

        submission.setStatus(ChallengeSubmission.SubmissionStatus.valueOf(request.getStatus()));
        submission.setReviewedBy(teacher.getId());
        submission.setReviewedAt(LocalDateTime.now());
        submission.setReviewNotes(request.getReviewNotes());

        if ("APPROVED".equals(request.getStatus())) {
            Challenge challenge = challengeRepository.findById(submission.getChallengeId())
                    .orElseThrow(() -> AppException.notFound("Challenge not found"));
            submission.setPointsEarned(challenge.getPoints());
            pointsService.awardChallengePoints(submission.getStudentId(), challenge.getPoints());
        }

        ChallengeSubmission saved = submissionRepository.save(submission);
        return ResponseEntity.ok(ApiResponse.success(saved));
    }
}
