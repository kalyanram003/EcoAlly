package com.ecolearn.repository;

import com.ecolearn.model.Challenge;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChallengeRepository extends MongoRepository<Challenge, String> {
    List<Challenge> findByIsPublishedTrueOrderByCreatedAtDesc();
    List<Challenge> findAllByOrderByCreatedAtDesc();
}
