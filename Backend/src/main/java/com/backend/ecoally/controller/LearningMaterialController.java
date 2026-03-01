package com.backend.ecoally.controller;

import com.backend.ecoally.dto.response.ApiResponse;
import com.backend.ecoally.exception.AppException;
import com.backend.ecoally.model.LearningMaterial;
import com.backend.ecoally.model.User;
import com.backend.ecoally.repository.LearningMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
@RequiredArgsConstructor
public class LearningMaterialController {

    private final LearningMaterialRepository materialRepository;

    // Teacher: get own materials
    @GetMapping("/my")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<LearningMaterial>>> getMyMaterials(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
                materialRepository.findByCreatedByOrderByCreatedAtDesc(user.getId())));
    }

    // Student or Anyone: get all published materials
    @GetMapping
    public ResponseEntity<ApiResponse<List<LearningMaterial>>> getAllPublished() {
        return ResponseEntity.ok(ApiResponse.success(
                materialRepository.findByIsPublishedTrueOrderByCreatedAtDesc()));
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<LearningMaterial>> create(
            @RequestBody LearningMaterial req,
            @AuthenticationPrincipal User user) {
        req.setCreatedBy(user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(materialRepository.save(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<LearningMaterial>> update(
            @PathVariable Long id,
            @RequestBody LearningMaterial req,
            @AuthenticationPrincipal User user) {
        LearningMaterial m = materialRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Material not found"));
        if (!m.getCreatedBy().equals(user.getId()))
            throw AppException.forbidden("Access denied");
        m.setTitle(req.getTitle());
        m.setDescription(req.getDescription());
        m.setType(req.getType());
        m.setUrl(req.getUrl());
        m.setTopic(req.getTopic());
        m.setTags(req.getTags());
        m.setPublished(req.isPublished());
        return ResponseEntity.ok(ApiResponse.success(materialRepository.save(m)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        LearningMaterial m = materialRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Material not found"));
        if (!m.getCreatedBy().equals(user.getId()))
            throw AppException.forbidden("Access denied");
        materialRepository.delete(m);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }
}
