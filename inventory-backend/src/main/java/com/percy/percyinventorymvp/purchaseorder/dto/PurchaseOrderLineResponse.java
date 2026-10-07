package com.percy.percyinventorymvp.purchaseorder.dto;

import java.math.BigDecimal;

public record PurchaseOrderLineResponse(

        Long id,

        Long productId,

        String productSku,

        String productName,

        int quantity,

        int receivedQuantity,

        BigDecimal unitPrice,

        BigDecimal lineTotal
) {
}