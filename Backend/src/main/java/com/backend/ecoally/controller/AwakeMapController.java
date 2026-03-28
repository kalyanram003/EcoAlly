package com.backend.ecoally.controller;

import com.backend.ecoally.dto.response.ApiResponse;
import com.backend.ecoally.model.AwakeReport;
import com.backend.ecoally.model.User;
import com.backend.ecoally.repository.AwakeReportRepository;
import com.backend.ecoally.repository.UserRepository;
import com.backend.ecoally.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/awakemap")
@RequiredArgsConstructor
public class AwakeMapController {

    private final AwakeReportRepository awakeReportRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    // ── GET /api/awakemap/reports ─────────────────────────────────────────────
    // Returns all reports (optionally filtered: ?status=OPEN or ?status=RESOLVED)
    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<List<AwakeReport>>> getReports(
            @RequestParam(required = false) String status) {

        List<AwakeReport> reports;

        if (status != null) {
            try {
                AwakeReport.ReportStatus s = AwakeReport.ReportStatus.valueOf(status.toUpperCase());
                reports = awakeReportRepository.findByStatusOrderByCreatedAtDesc(s);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid status value. Use OPEN or RESOLVED."));
            }
        } else {
            reports = awakeReportRepository.findAllByOrderByCreatedAtDesc();
        }

        return ResponseEntity.ok(ApiResponse.success(reports));
    }

    // ── POST /api/awakemap/reports ────────────────────────────────────────────
    // Submit a new unhygienic location report with photo + GPS
    @PostMapping("/reports")
    public ResponseEntity<ApiResponse<AwakeReport>> submitReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("photo") MultipartFile photo,
            @RequestParam("description") String description,
            @RequestParam("lat") Double lat,
            @RequestParam("lng") Double lng) {

        // Resolve reporter identity from JWT principal (username = email)
        Optional<User> userOpt = userRepository.findByEmail(userDetails.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authenticated user not found."));
        }
        User user = userOpt.get();

        // Upload before-photo to Cloudinary under the "awake_map" folder
        String photoUrl;
        try {
            photoUrl = storageService.uploadImage(photo, "awake_map");
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Photo upload failed: " + e.getMessage()));
        }

        AwakeReport report = new AwakeReport();
        report.setReporterId(user.getId());
        report.setReporterName(user.getFullName());
        report.setLat(lat);
        report.setLng(lng);
        report.setDescription(description);
        report.setBeforePhotoUrl(photoUrl);
        report.setStatus(AwakeReport.ReportStatus.OPEN);

        AwakeReport saved = awakeReportRepository.save(report);
        return ResponseEntity.ok(ApiResponse.success("Report submitted successfully.", saved));
    }

    // ── POST /api/awakemap/reports/{id}/resolve ───────────────────────────────
    // Upload an after-photo to mark the location as cleaned / resolved
    @PostMapping("/reports/{id}/resolve")
    public ResponseEntity<ApiResponse<AwakeReport>> resolveReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestParam("photo") MultipartFile photo) {

        Optional<AwakeReport> reportOpt = awakeReportRepository.findById(id);
        if (reportOpt.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.error("Report not found."));
        }

        AwakeReport report = reportOpt.get();

        if (report.getStatus() == AwakeReport.ReportStatus.RESOLVED) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("This location is already marked as resolved."));
        }

        // Resolve resolver identity
        Optional<User> userOpt = userRepository.findByEmail(userDetails.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authenticated user not found."));
        }
        User user = userOpt.get();

        // Upload after-photo to Cloudinary
        String afterPhotoUrl;
        try {
            afterPhotoUrl = storageService.uploadImage(photo, "awake_map_resolved");
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Photo upload failed: " + e.getMessage()));
        }

        report.setAfterPhotoUrl(afterPhotoUrl);
        report.setStatus(AwakeReport.ReportStatus.RESOLVED);
        report.setResolvedAt(LocalDateTime.now());
        report.setResolvedByUserId(user.getId());
        report.setResolvedByName(user.getFullName());

        AwakeReport updated = awakeReportRepository.save(report);
        return ResponseEntity.ok(ApiResponse.success("Marked as resolved. Thank you!", updated));
    }
}
