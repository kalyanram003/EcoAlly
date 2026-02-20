package com.ecolearn.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReviewSubmissionRequest {
    @NotBlank
    private String status; // APPROVED or REJECTED
    private String reviewNotes;
}
