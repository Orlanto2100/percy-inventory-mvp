package com.percy.percyinventorymvp.purchaseorder.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record PurchaseOrderUpdateRequest(

        @NotBlank
        String supplier,

        @NotNull
        LocalDate orderDate,

        LocalDate expectedDeliveryDate,

        String notes,

        @NotEmpty
        List<@Valid PurchaseOrderLineRequest> lines
) {
}