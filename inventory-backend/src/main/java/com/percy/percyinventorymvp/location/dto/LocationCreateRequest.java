package com.percy.percyinventorymvp.location.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LocationCreateRequest(
        @NotBlank String code,
        @NotBlank String name,
        @NotNull Long warehouseId
) {
}