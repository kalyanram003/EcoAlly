package com.backend.ecoally.controller;

import com.backend.ecoally.dto.response.ApiResponse;
import com.backend.ecoally.exception.AppException;
import com.backend.ecoally.model.Student;
import com.backend.ecoally.model.User;
import com.backend.ecoally.repository.StudentRepository;
import com.backend.ecoally.service.QuestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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

    @PostMapping("/shields/purchase")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> purchaseStreakShield(
            @AuthenticationPrincipal User user) {
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> AppException.notFound("Student profile not found"));

        final int SHIELD_COST = 250;
        if (student.getCoins() < SHIELD_COST) {
            throw AppException.badRequest("Not enough coins to buy a shield");
        }

        student.setCoins(student.getCoins() - SHIELD_COST);
        student.setStreakShields(student.getStreakShields() + 1);
        studentRepository.save(student);

        Map<String, Object> result = new HashMap<>();
        result.put("coins", student.getCoins());
        result.put("streakShields", student.getStreakShields());
        return ResponseEntity.ok(ApiResponse.success("Shield purchased", result));
    }
}
