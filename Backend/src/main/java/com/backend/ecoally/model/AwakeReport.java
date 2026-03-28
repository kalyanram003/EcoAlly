package com.backend.ecoally.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "awake_reports")
@EntityListeners(AuditingEntityListener.class)
public class AwakeReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Who filed this report (User.id, not Student.id)
    private Long reporterId;
    private String reporterName;

    // GPS coordinates captured from the browser
    private Double lat;
    private Double lng;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Cloudinary URL of the BEFORE photo (unhygienic)
    @Column(columnDefinition = "TEXT")
    private String beforePhotoUrl;

    // Cloudinary URL of the AFTER photo (once community cleans it)
    @Column(columnDefinition = "TEXT")
    private String afterPhotoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status = ReportStatus.OPEN;

    // Set when someone uploads the after-photo
    private LocalDateTime resolvedAt;
    private Long resolvedByUserId;
    private String resolvedByName;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum ReportStatus {
        OPEN,      // Red pin — issue still present
        RESOLVED   // Green pin — community cleaned it
    }
}
