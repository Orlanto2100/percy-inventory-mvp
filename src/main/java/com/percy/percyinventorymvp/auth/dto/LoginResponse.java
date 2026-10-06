package com.percy.percyinventorymvp.auth.dto;

import com.percy.percyinventorymvp.user.Role;

public record LoginResponse(
        String token,
        String username,
        Role role
) {
}