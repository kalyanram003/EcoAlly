package com.ecolearn.dto.request;

import com.ecolearn.model.User;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class RegisterRequest {

    private String email;
    private String phone;

    @NotBlank @Size(min = 3, max = 30)
    private String username;

    @NotBlank @Size(min = 6)
    private String password;

    @NotNull
    private User.UserType userType;

    @NotBlank private String firstName;
    @NotBlank private String lastName;

    private String dateOfBirth;
    private String gender;
    private String city;
    private String address;

    // Student-specific
    private String instituteName;
    private String instituteCity;
    private String instituteId;
    private String academicRollNo;
    private String gradeYear;
    private String sectionCourse;
    private String guardianName;
    private String guardianRelationship;
    private String guardianEmail;
    private String guardianPhone;
    private String guardianAddress;
    private String guardianOccupation;

    // Teacher-specific
    private String facultyId;
    private String rolePassword;
    private String department;
    private String specialization;

    // Admin-specific
    private String adminRole;
    private List<String> permissions;
}
