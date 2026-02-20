package com.ecolearn.repository;

import com.ecolearn.model.QuizAttempt;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface QuizAttemptRepository extends MongoRepository<QuizAttempt, String> {
    List<QuizAttempt> findByStudentIdOrderByCreatedAtDesc(String studentId);
}
