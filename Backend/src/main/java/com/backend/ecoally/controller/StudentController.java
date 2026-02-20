package com.backend.ecoally.controller;

import com.backend.ecoally.dto.request.UpdateProfileRequest;
import com.backend.ecoally.dto.response.ApiResponse;
import com.backend.ecoally.exception.AppException;
import com.backend.ecoally.model.ChallengeSubmission;
import com.backend.ecoally.model.Student;
import com.backend.ecoally.model.User;
import com.backend.ecoally.repository.ChallengeSubmissionRepository;
import com.backend.ecoally.repository.QuizAttemptRepository;
import com.backend.ecoally.repository.StudentRepository;
import com.backend.ecoally.repository.UserRepository;
import com.backend.ecoally.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final ChallengeSubmissionRepository submissionRepository;
    private final StorageService storageService;

    /**
     * GET /api/students/profile
     * Returns the current student's full profile (gamification stats + user info).
     */
    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(
            @AuthenticationPrincipal User user) {

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> AppException.notFound("Student not found"));

        long quizzesCompleted = quizAttemptRepository.countByStudentId(student.getId());
        long challengesCompleted = submissionRepository.countByStudentIdAndStatus(
                student.getId(), ChallengeSubmission.SubmissionStatus.APPROVED);

        Map<String, Object> profile = new HashMap<>();
        // User fields
        profile.put("id", user.getId());
        profile.put("name", user.getFullName());
        profile.put("email", user.getEmail());
        profile.put("username", user.getUsername());
        profile.put("avatarUrl", user.getAvatarUrl());
        profile.put("city", user.getCity());
        profile.put("address", user.getAddress());
        profile.put("joinDate", user.getCreatedAt());
        // Gamification fields
        profile.put("points", student.getPoints());
        profile.put("coins", student.getCoins());
        profile.put("currentStreak", student.getCurrentStreak());
        profile.put("longestStreak", student.getLongestStreak());
        profile.put("streakShields", student.getStreakShields());
        profile.put("level", student.getLevel());
        profile.put("tier", student.getTier());
        // Counts
        profile.put("quizzesCompleted", quizzesCompleted);
        profile.put("challengesCompleted", challengesCompleted);

        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    /**
     * PUT /api/students/profile
     * Updates name, city, address, and optionally the avatar URL.
     */
    @PutMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(
            @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal User user) {

        if (request.getFirstName() != null)
            user.setFirstName(request.getFirstName());
        if (request.getLastName() != null)
            user.setLastName(request.getLastName());
        if (request.getCity() != null)
            user.setCity(request.getCity());
        if (request.getAddress() != null)
            user.setAddress(request.getAddress());
        if (request.getAvatarUrl() != null)
            user.setAvatarUrl(request.getAvatarUrl());

        userRepository.save(user);

        Map<String, Object> updated = new HashMap<>();
        updated.put("name", user.getFullName());
        updated.put("city", user.getCity());
        updated.put("address", user.getAddress());
        updated.put("avatarUrl", user.getAvatarUrl());

        return ResponseEntity.ok(ApiResponse.success("Profile updated", updated));
    }

    /**
     * PUT /api/students/avatar
     * Uploads an avatar image to Cloudinary and saves the URL to the user record.
     */
    @PutMapping("/avatar")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user) throws IOException {

        String url = storageService.uploadImage(file, "avatars");
        user.setAvatarUrl(url);
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success(Map.of("avatarUrl", url)));
    }
}
