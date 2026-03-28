package com.backend.ecoally.repository;

import com.backend.ecoally.model.AwakeReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AwakeReportRepository extends JpaRepository<AwakeReport, Long> {

    // All reports ordered newest first
    List<AwakeReport> findAllByOrderByCreatedAtDesc();

    // Filter by status
    List<AwakeReport> findByStatusOrderByCreatedAtDesc(AwakeReport.ReportStatus status);
}
