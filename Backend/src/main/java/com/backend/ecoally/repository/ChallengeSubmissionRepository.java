package com.ecolearn.repository;

import com.ecolearn.model.ChallengeSubmission;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChallengeSubmissionRepository extends MongoRepository<ChallengeSubmission, String> {
    List<ChallengeSubmission> findByStudentIdOrderByCreatedAtDesc(String studentId);
    List<ChallengeSubmission> findByStatusOrderByCreatedAtDesc(ChallengeSubmission.SubmissionStatus status);
}
