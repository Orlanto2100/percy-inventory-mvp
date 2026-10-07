package com.percy.percyinventorymvp.dashboard;

import com.percy.percyinventorymvp.dashboard.dto.DashboardResponse;
import com.percy.percyinventorymvp.inventory.InventoryRepository;
import com.percy.percyinventorymvp.product.ProductRepository;
import com.percy.percyinventorymvp.purchaseorder.PurchaseOrderMapper;
import com.percy.percyinventorymvp.purchaseorder.PurchaseOrderRepository;
import com.percy.percyinventorymvp.purchaseorder.PurchaseOrderStatus;
import com.percy.percyinventorymvp.stockmovement.StockMovementMapper;
import com.percy.percyinventorymvp.stockmovement.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final StockMovementRepository stockMovementRepository;
    private final StockMovementMapper stockMovementMapper;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseOrderMapper purchaseOrderMapper;

    public DashboardResponse getDashboard() {

        long totalProducts =
                productRepository.count();

        var inventoryRecords =
                inventoryRepository.findAll();

        int totalInventoryQuantity =
                inventoryRecords.stream()
                        .mapToInt(inventory -> inventory.getQuantity())
                        .sum();

        Map<Long, Integer> inventoryByProduct =
                inventoryRecords.stream()
                        .collect(Collectors.groupingBy(
                                inventory ->
                                        inventory.getProduct().getId(),
                                Collectors.summingInt(
                                        inventory ->
                                                inventory.getQuantity()
                                )
                        ));

        List<DashboardResponse.ProductStockSummary>
                lowStockProducts =
                productRepository.findAll()
                        .stream()
                        .filter(product ->
                                inventoryByProduct.getOrDefault(
                                        product.getId(),
                                        0
                                ) <= product.getMinimumStock()
                        )
                        .map(product -> {

                            int currentQuantity =
                                    inventoryByProduct.getOrDefault(
                                            product.getId(),
                                            0
                                    );

                            return new DashboardResponse.ProductStockSummary(
                                    product.getId(),
                                    product.getSku(),
                                    product.getName(),
                                    currentQuantity,
                                    product.getMinimumStock()
                            );
                        })
                        .toList();

        var recentStockMovements =
                stockMovementRepository
                        .findTop10ByOrderByMovementDateDesc()
                        .stream()
                        .map(stockMovementMapper::toResponse)
                        .toList();

        var pendingPurchaseOrders =
                purchaseOrderRepository.findByStatusIn(
                                List.of(
                                        PurchaseOrderStatus.ORDERED,
                                        PurchaseOrderStatus.PARTIALLY_RECEIVED
                                )
                        )
                        .stream()
                        .map(purchaseOrderMapper::toResponse)
                        .toList();

        return new DashboardResponse(
                totalProducts,
                totalInventoryQuantity,
                lowStockProducts,
                recentStockMovements,
                pendingPurchaseOrders
        );
    }
}