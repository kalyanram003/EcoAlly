package com.backend.ecoally.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "learning_materials")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class LearningMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // "VIDEO", "PDF", "LINK", "ARTICLE", "DOCUMENT", "IMAGE"
    private String type;

    private String url; // YouTube URL, PDF URL, or external link
    private String topic;
    private String difficulty; // EASY, MEDIUM, HARD

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "material_tags", joinColumns = @JoinColumn(name = "material_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    private boolean isPublished = false;
    private Long createdBy; // User ID

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
