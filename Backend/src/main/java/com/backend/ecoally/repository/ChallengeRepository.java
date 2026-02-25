package com.backend.ecoally.repository;

import com.backend.ecoally.model.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    List<Challenge> findByIsPublishedTrue();

    List<Challenge> findByIsPublishedTrueOrderByCreatedAtDesc();

    List<Challenge> findAllByOrderByCreatedAtDesc();

    List<Challenge> findByCreatedBy(Long createdBy);

    List<Challenge> findByCreatedByOrderByCreatedAtDesc(Long createdBy);
}
