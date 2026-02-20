package com.backend.ecoally.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank
    private String identifier; // email, phone, or username

    @NotBlank
    private String password;
}
