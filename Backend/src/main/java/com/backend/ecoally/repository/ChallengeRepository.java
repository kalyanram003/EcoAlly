package com.backend.ecoally.repository;

import com.backend.ecoally.model.Challenge;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChallengeRepository extends MongoRepository<Challenge, String> {
    List<Challenge> findByIsPublishedTrueOrderByCreatedAtDesc();

    List<Challenge> findAllByOrderByCreatedAtDesc();

    List<Challenge> findByCreatedByOrderByCreatedAtDesc(String createdBy);
}
