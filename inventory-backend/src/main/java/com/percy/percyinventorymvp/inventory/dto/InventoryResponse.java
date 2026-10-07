package com.percy.percyinventorymvp.inventory.dto;

public record InventoryResponse(
        Long id,
        Long productId,
        String productSku,
        String productName,
        Long warehouseId,
        String warehouseName,
        Long locationId,
        String locationCode,
        String locationName,
        Integer quantity
) {
}