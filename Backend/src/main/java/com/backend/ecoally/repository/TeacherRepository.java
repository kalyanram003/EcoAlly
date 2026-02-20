package com.ecolearn.repository;

import com.ecolearn.model.Teacher;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface TeacherRepository extends MongoRepository<Teacher, String> {
    Optional<Teacher> findByUserId(String userId);
    boolean existsByFacultyId(String facultyId);
}
