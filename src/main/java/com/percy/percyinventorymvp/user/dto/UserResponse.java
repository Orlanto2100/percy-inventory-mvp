package com.percy.percyinventorymvp.user.dto;

import com.percy.percyinventorymvp.user.Role;

public record UserResponse(
        Long id,
        String username,
        Role role,
        boolean active
) {
}