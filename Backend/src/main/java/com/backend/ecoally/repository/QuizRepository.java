package com.ecolearn.repository;

import com.ecolearn.model.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface QuizRepository extends MongoRepository<Quiz, String> {
    List<Quiz> findByIsPublishedTrueOrderByCreatedAtDesc();
    List<Quiz> findByIsPublishedTrueAndTopicOrderByCreatedAtDesc(String topic);
    List<Quiz> findByIsPublishedTrueAndDifficultyOrderByCreatedAtDesc(Quiz.Difficulty difficulty);
    List<Quiz> findByIsPublishedTrueAndTopicAndDifficultyOrderByCreatedAtDesc(String topic, Quiz.Difficulty difficulty);
}
