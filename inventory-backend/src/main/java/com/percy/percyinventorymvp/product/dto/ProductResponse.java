package com.percy.percyinventorymvp.product.dto;

import java.time.LocalDateTime;

public record ProductResponse(
        Long id,
        String sku,
        String name,
        String category,
        String unit,
        Integer minimumStock,
        boolean active,
        LocalDateTime createdDate,
        LocalDateTime updatedDate
) {
}