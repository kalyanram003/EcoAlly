package com.backend.ecoally.controller;

import com.backend.ecoally.dto.response.ApiResponse;
import com.backend.ecoally.exception.AppException;
import com.backend.ecoally.model.ClassGroup;
import com.backend.ecoally.model.Teacher;
import com.backend.ecoally.model.User;
import com.backend.ecoally.repository.ClassGroupRepository;
import com.backend.ecoally.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/classes")
@PreAuthorize("hasRole('TEACHER')")
@RequiredArgsConstructor
public class ClassController {

    private final ClassGroupRepository classGroupRepository;
    private final TeacherRepository teacherRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClassGroup>>> getMyClasses(
            @AuthenticationPrincipal User user) {
        Teacher teacher = teacherRepository.findByUserId(user.getId())
                .orElseThrow(() -> AppException.notFound("Teacher not found"));
        return ResponseEntity.ok(ApiResponse.success(
                classGroupRepository.findByTeacherIdOrderByCreatedAtDesc(teacher.getId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClassGroup>> createClass(
            @RequestBody ClassGroup req,
            @AuthenticationPrincipal User user) {
        Teacher teacher = teacherRepository.findByUserId(user.getId())
                .orElseThrow(() -> AppException.notFound("Teacher not found"));
        req.setTeacherId(teacher.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(classGroupRepository.save(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClassGroup>> updateClass(
            @PathVariable Long id,
            @RequestBody ClassGroup req,
            @AuthenticationPrincipal User user) {
        ClassGroup cls = classGroupRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Class not found"));
        cls.setName(req.getName());
        cls.setSubject(req.getSubject());
        cls.setSchedule(req.getSchedule());
        cls.setStudentIds(req.getStudentIds());
        return ResponseEntity.ok(ApiResponse.success(classGroupRepository.save(cls)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteClass(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        classGroupRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }
}
