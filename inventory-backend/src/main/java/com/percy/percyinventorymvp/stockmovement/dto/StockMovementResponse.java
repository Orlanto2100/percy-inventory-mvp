package com.percy.percyinventorymvp.stockmovement.dto;

import com.percy.percyinventorymvp.stockmovement.StockMovementReason;
import com.percy.percyinventorymvp.stockmovement.StockMovementType;

import java.time.LocalDateTime;

public record StockMovementResponse(

        Long id,

        Long productId,
        String productSku,
        String productName,

        Long warehouseId,
        String warehouseName,

        Long locationId,
        String locationCode,
        String locationName,

        int quantity,

        StockMovementType type,
        StockMovementReason reason,

        Long performedById,
        String performedByUsername,

        LocalDateTime movementDate,

        Long referenceId,

        LocalDateTime createdDate
) {
}