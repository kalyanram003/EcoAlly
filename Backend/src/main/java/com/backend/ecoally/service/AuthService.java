package com.backend.ecoally.service;

import com.backend.ecoally.dto.request.LoginRequest;
import com.backend.ecoally.dto.request.RegisterRequest;
import com.backend.ecoally.exception.AppException;
import com.backend.ecoally.model.*;
import com.backend.ecoally.repository.*;
import com.backend.ecoally.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public Map<String, Object> register(RegisterRequest req) {
        // Validate at least email or phone
        if (req.getEmail() == null && req.getPhone() == null) {
            throw AppException.badRequest("Either email or phone must be provided");
        }

        // Check uniqueness
        if (req.getEmail() != null && userRepository.existsByEmail(req.getEmail())) {
            throw AppException.conflict("Email already registered");
        }
        if (req.getPhone() != null && userRepository.existsByPhone(req.getPhone())) {
            throw AppException.conflict("Phone number already registered");
        }
        if (userRepository.existsByUsername(req.getUsername())) {
            throw AppException.conflict("Username already taken");
        }

        // Create user
        User user = new User();
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setUserType(req.getUserType());
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setGender(req.getGender());
        user.setCity(req.getCity());
        user.setAddress(req.getAddress());
        user.setActive(true);

        user = userRepository.save(user);

        // Create role-specific record
        Object roleRecord = createRoleRecord(user, req);

        String token = jwtUtils.generateToken(user.getId(), user.getUserType().name());

        Map<String, Object> result = new HashMap<>();
        result.put("user", buildUserDto(user));
        result.put("roleRecord", roleRecord);
        result.put("token", token);
        return result;
    }

    public Map<String, Object> login(LoginRequest req) {
        User user = findByIdentifier(req.getIdentifier())
                .orElseThrow(() -> AppException.unauthorized("Invalid credentials"));

        if (!user.isActive()) {
            throw AppException.forbidden("Account is inactive. Please contact support.");
        }

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw AppException.unauthorized("Invalid credentials");
        }

        Object roleRecord = getRoleRecord(user);
        String token = jwtUtils.generateToken(user.getId(), user.getUserType().name());

        Map<String, Object> result = new HashMap<>();
        result.put("user", buildUserDto(user));
        result.put("roleRecord", roleRecord);
        result.put("token", token);
        return result;
    }

    public Map<String, Object> getMe(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> AppException.notFound("User not found"));

        Object roleRecord = getRoleRecord(user);

        Map<String, Object> result = new HashMap<>();
        result.put("user", buildUserDto(user));
        result.put("roleRecord", roleRecord);
        return result;
    }

    private java.util.Optional<User> findByIdentifier(String identifier) {
        return userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByPhone(identifier))
                .or(() -> userRepository.findByUsername(identifier));
    }

    private Object createRoleRecord(User user, RegisterRequest req) {
        return switch (user.getUserType()) {
            case STUDENT -> {
                Student student = new Student();
                student.setUserId(user.getId());
                student.setInstituteName(req.getInstituteName());
                student.setInstituteCity(req.getInstituteCity());
                student.setInstituteId(req.getInstituteId());
                student.setAcademicRollNo(req.getAcademicRollNo());
                student.setGradeYear(req.getGradeYear());
                student.setSectionCourse(req.getSectionCourse());
                student.setGuardianName(req.getGuardianName());
                student.setGuardianRelationship(req.getGuardianRelationship());
                student.setGuardianEmail(req.getGuardianEmail());
                student.setGuardianPhone(req.getGuardianPhone());
                student.setGuardianAddress(req.getGuardianAddress());
                student.setGuardianOccupation(req.getGuardianOccupation());
                yield studentRepository.save(student);
            }
            case TEACHER -> {
                Teacher teacher = new Teacher();
                teacher.setUserId(user.getId());
                teacher.setInstituteName(req.getInstituteName());
                teacher.setInstituteCity(req.getInstituteCity());
                teacher.setInstituteId(req.getInstituteId());
                teacher.setFacultyId(req.getFacultyId());
                teacher.setRolePassword(req.getRolePassword());
                teacher.setDepartment(req.getDepartment());
                teacher.setSpecialization(req.getSpecialization());
                yield teacherRepository.save(teacher);
            }
            case ADMIN -> {
                Admin admin = new Admin();
                admin.setUserId(user.getId());
                admin.setRole(req.getAdminRole() != null ? req.getAdminRole() : "ADMIN");
                if (req.getPermissions() != null) {
                    admin.setPermissions(req.getPermissions());
                }
                yield adminRepository.save(admin);
            }
        };
    }

    private Object getRoleRecord(User user) {
        return switch (user.getUserType()) {
            case STUDENT -> studentRepository.findByUserId(user.getId()).orElse(null);
            case TEACHER -> teacherRepository.findByUserId(user.getId()).orElse(null);
            case ADMIN -> adminRepository.findByUserId(user.getId()).orElse(null);
        };
    }

    private Map<String, Object> buildUserDto(User user) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", user.getId());
        dto.put("email", user.getEmail());
        dto.put("phone", user.getPhone());
        dto.put("username", user.getUsername());
        dto.put("userType", user.getUserType());
        dto.put("firstName", user.getFirstName());
        dto.put("lastName", user.getLastName());
        dto.put("fullName", user.getFullName());
        dto.put("avatarUrl", user.getAvatarUrl());
        dto.put("isActive", user.isActive());
        dto.put("createdAt", user.getCreatedAt());
        return dto;
    }
}
