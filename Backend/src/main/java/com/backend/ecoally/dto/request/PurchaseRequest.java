package com.backend.ecoally.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PurchaseRequest {

    @NotBlank
    private String itemId;

    @Min(1)
    private int cost;
}
