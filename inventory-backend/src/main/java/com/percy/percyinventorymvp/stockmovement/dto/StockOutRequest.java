package com.percy.percyinventorymvp.stockmovement.dto;

import com.percy.percyinventorymvp.stockmovement.StockMovementReason;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record StockOutRequest(

        @NotNull
        Long productId,

        @NotNull
        Long warehouseId,

        @NotNull
        Long locationId,

        @Positive
        int quantity,

        @NotNull
        StockMovementReason reason
) {
}