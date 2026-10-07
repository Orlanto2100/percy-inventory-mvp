package com.percy.percyinventorymvp.warehouse.dto;

public record WarehouseResponse(
        Long id,
        String code,
        String name,
        String address,
        String city,
        String phone,
        String email,
        boolean active
) {
}