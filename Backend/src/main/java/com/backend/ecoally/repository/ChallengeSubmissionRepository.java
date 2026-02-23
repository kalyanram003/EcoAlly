package com.backend.ecoally.repository;

import com.backend.ecoally.model.ChallengeSubmission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ChallengeSubmissionRepository extends MongoRepository<ChallengeSubmission, String> {

    List<ChallengeSubmission> findByStudentIdOrderByCreatedAtDesc(String studentId);

    List<ChallengeSubmission> findByStatusOrderByCreatedAtDesc(ChallengeSubmission.SubmissionStatus status);

    long countByStudentIdAndStatus(String studentId, ChallengeSubmission.SubmissionStatus status);

    long countByStatus(ChallengeSubmission.SubmissionStatus status);

    List<ChallengeSubmission> findTop5ByOrderByCreatedAtDesc();

    // Fetch approved submissions that have GPS coordinates and were auto-processed by EcoLens
    @Query("{ 'status': 'APPROVED', 'geoLat': { $ne: null }, 'geoLng': { $ne: null }, 'autoProcessed': true }")
    List<ChallengeSubmission> findApprovedGeoTaggedSubmissions(int limit);
}
