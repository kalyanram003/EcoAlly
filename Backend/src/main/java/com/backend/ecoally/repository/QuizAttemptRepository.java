package com.backend.ecoally.repository;

import com.backend.ecoally.model.QuizAttempt;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface QuizAttemptRepository extends MongoRepository<QuizAttempt, String> {
    List<QuizAttempt> findByStudentIdOrderByCreatedAtDesc(String studentId);

    long countByStudentId(String studentId);

    List<QuizAttempt> findTop5ByOrderByCreatedAtDesc();
}
