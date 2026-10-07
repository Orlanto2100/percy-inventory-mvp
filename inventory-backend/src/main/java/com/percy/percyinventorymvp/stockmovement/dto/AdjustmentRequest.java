package com.percy.percyinventorymvp.stockmovement.dto;

import com.percy.percyinventorymvp.stockmovement.StockMovementReason;
import jakarta.validation.constraints.NotNull;

public record AdjustmentRequest(
        @NotNull Long productId,
        @NotNull Long warehouseId,
        @NotNull Long locationId,
        int quantity,
        @NotNull StockMovementReason reason
) {}