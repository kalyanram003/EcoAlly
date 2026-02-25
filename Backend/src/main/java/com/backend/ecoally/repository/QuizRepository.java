package com.backend.ecoally.repository;

import com.backend.ecoally.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByIsPublishedTrue();

    List<Quiz> findByCreatedBy(Long createdBy);

    // Ordered variants used by QuizController
    List<Quiz> findByIsPublishedTrueOrderByCreatedAtDesc();

    List<Quiz> findByIsPublishedTrueAndTopicOrderByCreatedAtDesc(String topic);

    List<Quiz> findByIsPublishedTrueAndDifficultyOrderByCreatedAtDesc(Quiz.Difficulty difficulty);

    List<Quiz> findByIsPublishedTrueAndTopicAndDifficultyOrderByCreatedAtDesc(String topic, Quiz.Difficulty difficulty);

    // Used by TeacherController
    List<Quiz> findByCreatedByOrderByCreatedAtDesc(Long createdBy);
}
