package com.percy.percyinventorymvp.dashboard.dto;

import com.percy.percyinventorymvp.purchaseorder.dto.PurchaseOrderResponse;
import com.percy.percyinventorymvp.stockmovement.dto.StockMovementResponse;

import java.util.List;

public record DashboardResponse(
        long totalProducts,
        int totalInventoryQuantity,
        List<ProductStockSummary> lowStockProducts,
        List<StockMovementResponse> recentStockMovements,
        List<PurchaseOrderResponse> pendingPurchaseOrders
) {

    public record ProductStockSummary(
            Long productId,
            String sku,
            String name,
            int currentQuantity,
            int minimumStock
    ) {
    }
}