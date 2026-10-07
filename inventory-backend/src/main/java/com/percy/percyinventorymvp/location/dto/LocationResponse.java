package com.percy.percyinventorymvp.location.dto;

public record LocationResponse(
        Long id,
        String code,
        String name,
        Long warehouseId,
        boolean active
) {
}