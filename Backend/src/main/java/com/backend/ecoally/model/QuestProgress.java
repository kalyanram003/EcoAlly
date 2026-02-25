package com.backend.ecoally.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "quest_progresses", uniqueConstraints = @UniqueConstraint(name = "uq_student_quest_period", columnNames = {
        "student_id", "quest_id", "period_start" }))
@EntityListeners(AuditingEntityListener.class)
public class QuestProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "quest_id", nullable = false)
    private Long questId;

    private int progress = 0;
    private boolean completed = false;
    private LocalDateTime completedAt;

    @Column(name = "period_start")
    private LocalDateTime periodStart;

    private LocalDateTime periodEnd;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
