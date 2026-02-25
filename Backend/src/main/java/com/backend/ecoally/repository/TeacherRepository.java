package com.backend.ecoally.repository;

import com.backend.ecoally.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByUserId(Long userId);

    boolean existsByFacultyId(String facultyId);

    Optional<Teacher> findByFacultyId(String facultyId);
}
