package com.backend.ecoally.repository;

import com.backend.ecoally.model.ChallengeSubmission;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ChallengeSubmissionRepository extends JpaRepository<ChallengeSubmission, Long> {
    List<ChallengeSubmission> findByStudentId(Long studentId);

    List<ChallengeSubmission> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    List<ChallengeSubmission> findByChallengeId(Long challengeId);

    List<ChallengeSubmission> findByStatus(ChallengeSubmission.SubmissionStatus status);

    List<ChallengeSubmission> findByStatusOrderByCreatedAtDesc(ChallengeSubmission.SubmissionStatus status);

    List<ChallengeSubmission> findTop5ByOrderByCreatedAtDesc();

    Optional<ChallengeSubmission> findByStudentIdAndChallengeId(Long studentId, Long challengeId);

    long countByStudentIdAndStatus(Long studentId, ChallengeSubmission.SubmissionStatus status);

    long countByChallengeId(Long challengeId);

    long countByStatus(ChallengeSubmission.SubmissionStatus status);

    // Type-safe derived method — replaces fragile @Query string literal
    List<ChallengeSubmission> findByStatusAndGeoLatIsNotNullAndGeoLngIsNotNullOrderByCreatedAtDesc(
            ChallengeSubmission.SubmissionStatus status, Pageable pageable);
}
