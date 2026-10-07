package com.percy.percyinventorymvp.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductCreateRequest(

        @NotBlank
        String sku,

        @NotBlank
        String name,

        @NotBlank
        String category,

        @NotBlank
        String unit,

        @NotNull
        @Min(0)
        Integer minimumStock
) {
}