package com.percy.percyinventorymvp.user;

import com.percy.percyinventorymvp.user.dto.UserCreateRequest;
import com.percy.percyinventorymvp.user.dto.UserResponse;
import com.percy.percyinventorymvp.user.dto.UserUpdateRequest;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserCreateRequest request) {
        return new User(
                request.username(),
                request.password(),
                request.role()
        );
    }

    public void updateEntity(User user, UserUpdateRequest request) {
        user.setUsername(request.username());
        user.setRole(request.role());
    }

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                user.isActive()
        );
    }
}