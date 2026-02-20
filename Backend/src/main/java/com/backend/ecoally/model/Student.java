package com.ecolearn.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "students")
public class Student {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

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

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
