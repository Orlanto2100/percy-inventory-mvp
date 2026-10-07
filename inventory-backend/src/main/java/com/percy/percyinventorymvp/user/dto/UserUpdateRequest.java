package com.percy.percyinventorymvp.user.dto;

import com.percy.percyinventorymvp.user.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserUpdateRequest(

        @NotBlank
        String username,

        @NotNull
        Role role
) {
}