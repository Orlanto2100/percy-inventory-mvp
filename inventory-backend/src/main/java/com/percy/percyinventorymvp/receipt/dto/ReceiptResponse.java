package com.percy.percyinventorymvp.receipt.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReceiptResponse(

        Long id,

        Long purchaseOrderId,
        String poNumber,

        Long purchaseOrderLineId,

        Long productId,
        String productSku,
        String productName,

        int receivedQuantity,

        Long warehouseId,
        String warehouseName,

        Long locationId,
        String locationCode,
        String locationName,

        LocalDate receivingDate,

        Long receivedById,
        String receivedByUsername,

        LocalDateTime createdDate,
        LocalDateTime updatedDate
) {
}