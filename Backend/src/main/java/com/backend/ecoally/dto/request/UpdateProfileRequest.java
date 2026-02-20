package com.backend.ecoally.dto.request;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String city;
    private String address;
    private String avatarUrl; // Cloudinary URL after client-side upload (optional)
}
