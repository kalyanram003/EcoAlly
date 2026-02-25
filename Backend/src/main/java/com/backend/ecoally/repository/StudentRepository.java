package com.backend.ecoally.repository;

import com.backend.ecoally.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    List<Student> findAllByOrderByPointsDesc();

    long countByPointsGreaterThan(int points);

    long countByLastActiveDateBetween(LocalDateTime from, LocalDateTime to);
}
