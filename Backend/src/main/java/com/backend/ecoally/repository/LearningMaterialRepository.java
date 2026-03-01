package com.backend.ecoally.repository;

import com.backend.ecoally.model.LearningMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearningMaterialRepository extends JpaRepository<LearningMaterial, Long> {
    List<LearningMaterial> findByCreatedByOrderByCreatedAtDesc(Long userId);

    List<LearningMaterial> findByIsPublishedTrueOrderByCreatedAtDesc();
}
