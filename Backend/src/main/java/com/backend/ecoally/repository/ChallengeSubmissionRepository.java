package com.backend.ecoally.repository;

import com.backend.ecoally.model.ChallengeSubmission;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

    @Query("SELECT s FROM ChallengeSubmission s WHERE s.status = 'APPROVED' AND s.geoLat IS NOT NULL AND s.geoLng IS NOT NULL ORDER BY s.createdAt DESC")
    List<ChallengeSubmission> findApprovedGeoTaggedSubmissions(Pageable pageable);
}
