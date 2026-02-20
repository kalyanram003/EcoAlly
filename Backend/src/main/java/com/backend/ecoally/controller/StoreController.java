package com.backend.ecoally.controller;

import com.backend.ecoally.dto.request.PurchaseRequest;
import com.backend.ecoally.dto.response.ApiResponse;
import com.backend.ecoally.exception.AppException;
import com.backend.ecoally.model.Student;
import com.backend.ecoally.model.User;
import com.backend.ecoally.repository.StudentRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/store")
@RequiredArgsConstructor
public class StoreController {

    private final StudentRepository studentRepository;

    /**
     * POST /api/store/purchase
     * Deducts coins and adds the item to the student's owned list.
     */
    @PostMapping("/purchase")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> purchaseItem(
            @Valid @RequestBody PurchaseRequest request,
            @AuthenticationPrincipal User user) {

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> AppException.notFound("Student not found"));

        if (student.getCoins() < request.getCost()) {
            throw AppException.badRequest("Not enough coins");
        }
        if (student.getOwnedItems().contains(request.getItemId())) {
            throw AppException.badRequest("Item already owned");
        }

        student.setCoins(student.getCoins() - request.getCost());
        student.getOwnedItems().add(request.getItemId());
        studentRepository.save(student);

        Map<String, Object> result = new HashMap<>();
        result.put("coins", student.getCoins());
        result.put("ownedItems", student.getOwnedItems());
        return ResponseEntity.ok(ApiResponse.success("Purchase successful", result));
    }

    @GetMapping("/owned")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<String>>> getOwnedItems(
            @AuthenticationPrincipal User user) {

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> AppException.notFound("Student not found"));

        return ResponseEntity.ok(ApiResponse.success(student.getOwnedItems()));
    }
}
