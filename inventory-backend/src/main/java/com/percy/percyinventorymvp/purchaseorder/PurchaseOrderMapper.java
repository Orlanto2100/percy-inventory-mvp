package com.percy.percyinventorymvp.purchaseorder;

import com.percy.percyinventorymvp.purchaseorder.dto.PurchaseOrderLineResponse;
import com.percy.percyinventorymvp.purchaseorder.dto.PurchaseOrderResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PurchaseOrderMapper {

    public PurchaseOrderResponse toResponse(PurchaseOrder purchaseOrder) {

        List<PurchaseOrderLineResponse> lines =
                purchaseOrder.getLines()
                        .stream()
                        .map(this::toLineResponse)
                        .toList();

        return new PurchaseOrderResponse(
                purchaseOrder.getId(),
                purchaseOrder.getPoNumber(),
                purchaseOrder.getSupplier(),
                purchaseOrder.getCreatedBy().getId(),
                purchaseOrder.getCreatedBy().getUsername(),
                purchaseOrder.getOrderDate(),
                purchaseOrder.getExpectedDeliveryDate(),
                purchaseOrder.getStatus(),
                purchaseOrder.getNotes(),
                purchaseOrder.getTotalQuantity(),
                purchaseOrder.getTotalAmount(),
                purchaseOrder.getCreatedDate(),
                purchaseOrder.getUpdatedDate(),
                lines
        );
    }

    private PurchaseOrderLineResponse toLineResponse(
            PurchaseOrderLine line
    ) {
        return new PurchaseOrderLineResponse(
                line.getId(),
                line.getProduct().getId(),
                line.getProduct().getSku(),
                line.getProduct().getName(),
                line.getQuantity(),
                line.getReceivedQuantity(),
                line.getUnitPrice(),
                line.getLineTotal()
        );
    }
}