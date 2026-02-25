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

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "students")
@EntityListeners(AuditingEntityListener.class)
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private Long userId;

    // Institute details
    private String instituteName;
    private String instituteCity;
    private String instituteId;
    private String academicRollNo;
    private String gradeYear;
    private String sectionCourse;

    // Guardian info
    private String guardianName;
    private String guardianRelationship;
    private String guardianEmail;
    private String guardianPhone;
    private String guardianAddress;
    private String guardianOccupation;

    // Gamification
    private int points = 0;
    private int coins = 0;
    private int currentStreak = 0;
    private int longestStreak = 0;
    private int streakShields = 0;
    private LocalDateTime lastActiveDate;
    private int level = 1;
    private String tier = "sprout";

    // ownedItems stored as a separate collection table
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_owned_items", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "item_id")
    private List<String> ownedItems = new ArrayList<>();

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
