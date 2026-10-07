package com.percy.percyinventorymvp.purchaseorder;

import com.percy.percyinventorymvp.purchaseorder.dto.PurchaseOrderCreateRequest;
import com.percy.percyinventorymvp.purchaseorder.dto.PurchaseOrderResponse;
import com.percy.percyinventorymvp.purchaseorder.dto.PurchaseOrderUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @PostMapping
    public ResponseEntity<PurchaseOrderResponse> createPurchaseOrder(
            @Valid @RequestBody PurchaseOrderCreateRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        purchaseOrderService.createPurchaseOrder(request)
                );
    }

    @GetMapping
    public ResponseEntity<List<PurchaseOrderResponse>> getPurchaseOrders() {
        return ResponseEntity.ok(
                purchaseOrderService.getPurchaseOrders()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderResponse> getPurchaseOrderById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                purchaseOrderService.getPurchaseOrderById(id)
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PurchaseOrderResponse> updatePurchaseOrder(
            @PathVariable Long id,
            @Valid @RequestBody PurchaseOrderUpdateRequest request
    ) {
        return ResponseEntity.ok(
                purchaseOrderService.updatePurchaseOrder(
                        id,
                        request
                )
        );
    }

    @PatchMapping("/{id}/order")
    public ResponseEntity<PurchaseOrderResponse> orderPurchaseOrder(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                purchaseOrderService.orderPurchaseOrder(id)
        );
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<PurchaseOrderResponse> cancelPurchaseOrder(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                purchaseOrderService.cancelPurchaseOrder(id)
        );
    }
}