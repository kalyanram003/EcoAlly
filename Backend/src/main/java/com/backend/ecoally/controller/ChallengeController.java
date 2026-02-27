package com.backend.ecoally.controller;

import com.backend.ecoally.dto.request.CreateChallengeRequest;
import com.backend.ecoally.dto.request.ReviewSubmissionRequest;
import com.backend.ecoally.dto.response.ApiResponse;
import com.backend.ecoally.dto.response.MLAnalysisResult;
import com.backend.ecoally.exception.AppException;
import com.backend.ecoally.model.*;
import com.backend.ecoally.repository.*;
import com.backend.ecoally.service.EcoLensService;
import com.backend.ecoally.service.PointsService;
import com.backend.ecoally.service.StorageService;
import com.backend.ecoally.service.StreakService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.backend.ecoally.repository.UserRepository;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
public class ChallengeController {

    private final ChallengeRepository challengeRepository;
    private final ChallengeSubmissionRepository submissionRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;
    private final PointsService pointsService;
    private final StreakService streakService;
    private final EcoLensService ecoLensService;

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
            @PathVariable Long id,
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
            @PathVariable Long id,
            @RequestBody CreateChallengeRequest request,
            @AuthenticationPrincipal User user) {
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Challenge not found"));

        if (!challenge.getCreatedBy().equals(user.getId())) {
            throw AppException.forbidden("Access denied");
        }

        if (request.getTitle() != null)
            challenge.setTitle(request.getTitle());
        if (request.getDescription() != null)
            challenge.setDescription(request.getDescription());
        if (request.getPoints() != null)
            challenge.setPoints(request.getPoints());
        if (request.getDifficulty() != null)
            challenge.setDifficulty(request.getDifficulty());
        if (request.getType() != null)
            challenge.setType(request.getType());
        if (request.getDuration() != null)
            challenge.setDuration(request.getDuration());
        challenge.setPublished(request.isPublished());

        Challenge updated = challengeRepository.save(challenge);
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteChallenge(
            @PathVariable Long id,
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
            @PathVariable Long id,
            @RequestParam(required = false) String notes,
            @RequestParam(required = false) Double geoLat,
            @RequestParam(required = false) Double geoLng,
            @RequestParam(required = false) List<MultipartFile> media,
            @AuthenticationPrincipal User user) throws IOException {

        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Challenge not found"));

        if (!challenge.isPublished()) {
            throw AppException.badRequest("Challenge is not published");
        }

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> AppException.notFound("Student profile not found"));

        // Upload media to Cloudinary (existing logic)
        List<String> mediaUrls = new ArrayList<>();
        if (media != null && !media.isEmpty()) {
            for (MultipartFile file : media) {
                String url = storageService.uploadImage(file, "challenges");
                mediaUrls.add(url);
            }
        }

        // Build submission
        ChallengeSubmission submission = new ChallengeSubmission();
        submission.setStudentId(student.getId());
        submission.setChallengeId(challenge.getId());
        submission.setMediaUrls(mediaUrls);
        submission.setNotes(notes);
        submission.setGeoLat(geoLat);
        submission.setGeoLng(geoLng);

        // ── EcoLens ML Analysis (NEW) ─────────────────────────────────────────
        if (challenge.getType() == Challenge.ChallengeType.PHOTO && !mediaUrls.isEmpty()) {
            MLAnalysisResult mlResult = ecoLensService.analyzeImage(
                    mediaUrls.get(0),
                    geoLat,
                    geoLng,
                    student.getId().toString(),
                    challenge.getId().toString());

            if (mlResult != null && mlResult.isSuccess()) {
                double ecoScore = mlResult.getEcoScore();
                double bonusMultiplier = mlResult.getBonusMultiplier();

                submission.setEcoScore(ecoScore);
                submission.setDetectedCategory(mlResult.getCategory());
                submission.setDetectedSpecies(mlResult.getDetectedSpecies());
                submission.setIsNativeSpecies(mlResult.getIsNativeSpecies());
                submission.setBonusMultiplier(bonusMultiplier);
                submission.setAutoDecisionReason(mlResult.getAutoDecisionReason());
                submission.setAutoProcessed(true);

                String autoDecision = mlResult.getAutoDecision();

                if ("AUTO_APPROVED".equals(autoDecision)) {
                    submission.setStatus(ChallengeSubmission.SubmissionStatus.APPROVED);
                    int basePoints = challenge.getPoints();
                    int finalPoints = (int) (basePoints * bonusMultiplier);
                    submission.setPointsEarned(finalPoints);
                    pointsService.awardChallengePoints(student.getId(), finalPoints);

                } else if ("AUTO_REJECTED".equals(autoDecision)) {
                    submission.setStatus(ChallengeSubmission.SubmissionStatus.REJECTED);

                } else {
                    submission.setStatus(ChallengeSubmission.SubmissionStatus.PENDING);
                }
            }
            // If mlResult == null or !success (ML service down / error), stays PENDING for
            // manual review
        }

        ChallengeSubmission saved = submissionRepository.save(submission);
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
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPendingSubmissions() {
        List<ChallengeSubmission> submissions = submissionRepository
                .findByStatusOrderByCreatedAtDesc(ChallengeSubmission.SubmissionStatus.PENDING);

        List<Map<String, Object>> enriched = submissions.stream().map(sub -> {
            Map<String, Object> entry = new LinkedHashMap<>();

            // Core submission fields
            entry.put("id", sub.getId());
            entry.put("studentId", sub.getStudentId());
            entry.put("challengeId", sub.getChallengeId());
            entry.put("status", sub.getStatus().name());
            entry.put("notes", sub.getNotes());
            entry.put("mediaUrls", sub.getMediaUrls());
            entry.put("ecoScore", sub.getEcoScore());
            entry.put("detectedCategory", sub.getDetectedCategory());
            entry.put("detectedSpecies", sub.getDetectedSpecies());
            entry.put("isNativeSpecies", sub.getIsNativeSpecies());
            entry.put("autoDecisionReason", sub.getAutoDecisionReason());
            entry.put("bonusMultiplier", sub.getBonusMultiplier());
            entry.put("geoLat", sub.getGeoLat());
            entry.put("geoLng", sub.getGeoLng());
            entry.put("createdAt", sub.getCreatedAt());

            // Enrich: student name + avatar
            studentRepository.findById(sub.getStudentId()).ifPresent(student -> {
                entry.put("instituteName", student.getInstituteName());
                entry.put("instituteCity", student.getInstituteCity());
                userRepository.findById(student.getUserId()).ifPresent(user -> {
                    entry.put("studentName", user.getFullName());
                    entry.put("studentAvatar", user.getAvatarUrl());
                });
            });

            // Enrich: challenge title + points
            challengeRepository.findById(sub.getChallengeId()).ifPresent(challenge -> {
                entry.put("challengeTitle", challenge.getTitle());
                entry.put("challengePoints", challenge.getPoints());
                entry.put("challengeType", challenge.getType().name());
            });

            return entry;
        }).collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(enriched));
    }

    @PutMapping("/submissions/{id}/review")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<ChallengeSubmission>> reviewSubmission(
            @PathVariable Long id,
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
