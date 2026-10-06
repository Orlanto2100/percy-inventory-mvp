package com.percy.percyinventorymvp.user.dto;

import com.percy.percyinventorymvp.user.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserCreateRequest(

        @NotBlank
        String username,

        @NotBlank
        String password,

        @NotNull
        Role role
) {
}