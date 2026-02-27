package com.backend.ecoally.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String phone;

    @Column(unique = true, nullable = false)
    private String username;

    private String password;

    @Enumerated(EnumType.STRING)
    private UserType userType;

    private String firstName;
    private String lastName;

    private LocalDate dateOfBirth;
    private String gender;
    private String city;
    private String address;
    private String avatarUrl;

    private boolean isActive = true;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public String getFullName() {
        String first = (firstName != null && !firstName.isBlank()) ? firstName : "";
        String last = (lastName != null && !lastName.isBlank()) ? lastName : "";
        String full = (first + " " + last).trim();
        return full.isEmpty() ? username : full;
    }

    public enum UserType {
        STUDENT, TEACHER, ADMIN
    }
}
