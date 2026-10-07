package com.percy.percyinventorymvp.receipt.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record ReceiptCreateRequest(

        @NotNull
        Long purchaseOrderLineId,

        @Positive
        int receivedQuantity,

        @NotNull
        Long warehouseId,

        @NotNull
        Long locationId,

        @NotNull
        LocalDate receivingDate
) {
}