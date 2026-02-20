package com.backend.ecoally.repository;

import com.backend.ecoally.model.ChallengeSubmission;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChallengeSubmissionRepository extends MongoRepository<ChallengeSubmission, String> {
    List<ChallengeSubmission> findByStudentIdOrderByCreatedAtDesc(String studentId);
    List<ChallengeSubmission> findByStatusOrderByCreatedAtDesc(ChallengeSubmission.SubmissionStatus status);
    long countByStudentIdAndStatus(String studentId, ChallengeSubmission.SubmissionStatus status);
    long countByStatus(ChallengeSubmission.SubmissionStatus status);
    List<ChallengeSubmission> findTop5ByOrderByCreatedAtDesc();
}
