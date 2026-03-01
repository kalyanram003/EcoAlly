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
@Table(name = "class_groups")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ClassGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // e.g., "Grade 11-A"
    private String subject;
    private String schedule; // e.g., "Mon, Wed, Fri - 9:00 AM"
    private Long teacherId; // FK to Teacher.id

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "class_student_ids", joinColumns = @JoinColumn(name = "class_id"))
    @Column(name = "student_id")
    private List<Long> studentIds = new ArrayList<>();

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
