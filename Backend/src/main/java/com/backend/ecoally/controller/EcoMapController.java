package com.backend.ecoally.controller;

import com.backend.ecoally.dto.response.ApiResponse;
import com.backend.ecoally.model.ChallengeSubmission;
import com.backend.ecoally.model.Student;
import com.backend.ecoally.model.User;
import com.backend.ecoally.repository.ChallengeSubmissionRepository;
import com.backend.ecoally.repository.StudentRepository;
import com.backend.ecoally.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/ecomap")
@RequiredArgsConstructor
public class EcoMapController {

    private final ChallengeSubmissionRepository submissionRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    /**
     * Returns all approved geo-tagged submissions for the EcoMap.
     * Each entry includes student name, plant species, photo, and coordinates.
     */
    @GetMapping("/pins")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getEcoMapPins(
            @RequestParam(required = false) String instituteId,
            @RequestParam(defaultValue = "100") int limit
    ) {

        // Fetch approved submissions that have geo coordinates
        List<ChallengeSubmission> submissions = submissionRepository
                .findApprovedGeoTaggedSubmissions(PageRequest.of(0, limit));

        List<Map<String, Object>> pins = new ArrayList<>();

        for (ChallengeSubmission submission : submissions) {
            // Skip entries without coordinates
            if (submission.getGeoLat() == null || submission.getGeoLng() == null) continue;

            // Get student info
            Optional<Student> studentOpt = studentRepository.findById(submission.getStudentId());
            if (studentOpt.isEmpty()) continue;

            Student student = studentOpt.get();
            Optional<User> userOpt = userRepository.findById(student.getUserId());
            if (userOpt.isEmpty()) continue;

            User user = userOpt.get();

            // Filter by institute if requested (for school-level view)
            if (instituteId != null && !instituteId.equals(student.getInstituteId())) continue;

            Map<String, Object> pin = new LinkedHashMap<>();
            pin.put("submissionId", submission.getId());
            pin.put("lat", submission.getGeoLat());
            pin.put("lng", submission.getGeoLng());

            // Student info
            pin.put("studentName", user.getFullName());
            pin.put("instituteName", student.getInstituteName());
            pin.put("instituteCity", student.getInstituteCity());
            pin.put("studentTier", student.getTier());

            // Plant / eco info from ML
            pin.put("detectedSpecies", submission.getDetectedSpecies());
            pin.put("detectedCategory", submission.getDetectedCategory());
            pin.put("isNativeSpecies", submission.getIsNativeSpecies());
            pin.put("ecoScore", submission.getEcoScore());
            pin.put("bonusMultiplier", submission.getBonusMultiplier());

            // Photo thumbnail (first image from Cloudinary)
            if (submission.getMediaUrls() != null && !submission.getMediaUrls().isEmpty()) {
                pin.put("photoUrl", submission.getMediaUrls().get(0));
            }

            pin.put("submittedAt", submission.getCreatedAt());

            pins.add(pin);
        }

        return ResponseEntity.ok(ApiResponse.success(pins));
    }

    /**
     * Returns biodiversity stats for the map header.
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEcoMapStats() {
        List<ChallengeSubmission> all = submissionRepository
                .findApprovedGeoTaggedSubmissions(PageRequest.of(0, 10000));

        long totalPins = all.stream().filter(s -> s.getGeoLat() != null).count();
        long nativeSpeciesCount = all.stream()
                .filter(s -> Boolean.TRUE.equals(s.getIsNativeSpecies()))
                .count();
        long uniqueSpeciesCount = all.stream()
                .map(ChallengeSubmission::getDetectedSpecies)
                .filter(Objects::nonNull)
                .distinct()
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPins", totalPins);
        stats.put("nativeSpeciesCount", nativeSpeciesCount);
        stats.put("uniqueSpeciesCount", uniqueSpeciesCount);

        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}

