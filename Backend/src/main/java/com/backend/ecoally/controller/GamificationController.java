package com.ecolearn.controller;

import com.ecolearn.dto.response.ApiResponse;
import com.ecolearn.exception.AppException;
import com.ecolearn.model.Student;
import com.ecolearn.model.User;
import com.ecolearn.repository.StudentRepository;
import com.ecolearn.service.QuestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gamification")
@RequiredArgsConstructor
public class GamificationController {

    private final QuestService questService;
    private final StudentRepository studentRepository;

    @GetMapping("/quests")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMyQuests(
            @AuthenticationPrincipal User user) {
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> AppException.notFound("Student profile not found"));

        List<Map<String, Object>> quests = questService.getActiveQuests(student.getId());
        return ResponseEntity.ok(ApiResponse.success(quests));
    }

    @PostMapping("/quests/{id}/claim")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> claimQuestReward(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> AppException.notFound("Student profile not found"));

        Map<String, Object> result = questService.claimQuestReward(student.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
