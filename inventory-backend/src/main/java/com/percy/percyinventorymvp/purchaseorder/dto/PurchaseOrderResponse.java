package com.percy.percyinventorymvp.purchaseorder.dto;

import com.percy.percyinventorymvp.purchaseorder.PurchaseOrderStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record PurchaseOrderResponse(

        Long id,

        String poNumber,

        String supplier,

        Long createdById,

        String createdByUsername,

        LocalDate orderDate,

        LocalDate expectedDeliveryDate,

        PurchaseOrderStatus status,

        String notes,

        int totalQuantity,

        BigDecimal totalAmount,

        LocalDateTime createdDate,

        LocalDateTime updatedDate,

        List<PurchaseOrderLineResponse> lines
) {
}