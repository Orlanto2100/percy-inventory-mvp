package com.percy.percyinventorymvp.receipt;

import com.percy.percyinventorymvp.receipt.dto.ReceiptResponse;
import org.springframework.stereotype.Component;

@Component
public class ReceiptMapper {

    public ReceiptResponse toResponse(Receipt receipt) {

        return new ReceiptResponse(
                receipt.getId(),

                receipt.getPurchaseOrder().getId(),
                receipt.getPurchaseOrder().getPoNumber(),

                receipt.getPurchaseOrderLine().getId(),

                receipt.getPurchaseOrderLine().getProduct().getId(),
                receipt.getPurchaseOrderLine().getProduct().getSku(),
                receipt.getPurchaseOrderLine().getProduct().getName(),

                receipt.getReceivedQuantity(),

                receipt.getWarehouse().getId(),
                receipt.getWarehouse().getName(),

                receipt.getLocation().getId(),
                receipt.getLocation().getCode(),
                receipt.getLocation().getName(),

                receipt.getReceivingDate(),

                receipt.getReceivedBy().getId(),
                receipt.getReceivedBy().getUsername(),

                receipt.getCreatedDate(),
                receipt.getUpdatedDate()
        );
    }
}