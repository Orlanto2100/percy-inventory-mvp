package com.percy.percyinventorymvp.warehouse.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record WarehouseUpdateRequest(

        @NotBlank
        String code,

        @NotBlank
        String name,

        @NotBlank
        String address,

        @NotBlank
        String city,

        @NotBlank
        String phone,

        @NotBlank
        @Email
        String email
) {
}