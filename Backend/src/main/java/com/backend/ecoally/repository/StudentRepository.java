package com.backend.ecoally.repository;

import com.backend.ecoally.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByUserId(String userId);

    List<Student> findAllByOrderByPointsDesc();

    long countByPointsGreaterThan(int points);

    long countByLastActiveDateBetween(LocalDateTime from, LocalDateTime to);
}
