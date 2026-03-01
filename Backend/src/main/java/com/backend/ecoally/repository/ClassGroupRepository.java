package com.backend.ecoally.repository;

import com.backend.ecoally.model.ClassGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassGroupRepository extends JpaRepository<ClassGroup, Long> {
    List<ClassGroup> findByTeacherIdOrderByCreatedAtDesc(Long teacherId);
}
