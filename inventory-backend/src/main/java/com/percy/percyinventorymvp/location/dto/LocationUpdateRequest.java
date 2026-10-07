package com.percy.percyinventorymvp.location.dto;

import jakarta.validation.constraints.NotBlank;

public record LocationUpdateRequest(
        @NotBlank String code,
        @NotBlank String name
) {
}