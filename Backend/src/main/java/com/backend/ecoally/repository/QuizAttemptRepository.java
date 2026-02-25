package com.backend.ecoally.repository;

import com.backend.ecoally.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByStudentId(Long studentId);

    List<QuizAttempt> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    List<QuizAttempt> findByStudentIdAndQuizId(Long studentId, Long quizId);

    boolean existsByStudentIdAndQuizId(Long studentId, Long quizId);

    long countByStudentId(Long studentId);

    long countByQuizId(Long quizId);

    List<QuizAttempt> findTop5ByOrderByCreatedAtDesc();
}
