package com.percy.percyinventorymvp.receipt;

import com.percy.percyinventorymvp.common.exception.BusinessRuleException;
import com.percy.percyinventorymvp.common.exception.ResourceNotFoundException;
import com.percy.percyinventorymvp.inventory.Inventory;
import com.percy.percyinventorymvp.inventory.InventoryRepository;
import com.percy.percyinventorymvp.location.Location;
import com.percy.percyinventorymvp.location.LocationRepository;
import com.percy.percyinventorymvp.purchaseorder.PurchaseOrder;
import com.percy.percyinventorymvp.purchaseorder.PurchaseOrderLine;
import com.percy.percyinventorymvp.purchaseorder.PurchaseOrderLineRepository;
import com.percy.percyinventorymvp.purchaseorder.PurchaseOrderRepository;
import com.percy.percyinventorymvp.purchaseorder.PurchaseOrderStatus;
import com.percy.percyinventorymvp.product.Product;
import com.percy.percyinventorymvp.receipt.dto.ReceiptCreateRequest;
import com.percy.percyinventorymvp.receipt.dto.ReceiptResponse;
import com.percy.percyinventorymvp.stockmovement.StockMovement;
import com.percy.percyinventorymvp.stockmovement.StockMovementReason;
import com.percy.percyinventorymvp.stockmovement.StockMovementRepository;
import com.percy.percyinventorymvp.stockmovement.StockMovementType;
import com.percy.percyinventorymvp.user.User;
import com.percy.percyinventorymvp.user.UserRepository;
import com.percy.percyinventorymvp.warehouse.Warehouse;
import com.percy.percyinventorymvp.warehouse.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseOrderLineRepository purchaseOrderLineRepository;
    private final WarehouseRepository warehouseRepository;
    private final LocationRepository locationRepository;
    private final InventoryRepository inventoryRepository;
    private final StockMovementRepository stockMovementRepository;
    private final UserRepository userRepository;
    private final ReceiptMapper receiptMapper;

    @Transactional
    public ReceiptResponse createReceipt(
            ReceiptCreateRequest request
    ) {

        /*
         * 1. Find the purchase order line.
         */
        PurchaseOrderLine purchaseOrderLine =
                purchaseOrderLineRepository.findById(
                        request.purchaseOrderLineId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Purchase order line not found"
                        )
                );

        /*
         * 2. Get the purchase order from the line.
         */
        PurchaseOrder purchaseOrder =
                purchaseOrderLine.getPurchaseOrder();

        /*
         * 3. Validate PO status.
         */
        if (purchaseOrder.getStatus()
                == PurchaseOrderStatus.CANCELLED) {

            throw new BusinessRuleException(
                    "Cancelled purchase orders cannot be received"
            );
        }

        if (purchaseOrder.getStatus()
                == PurchaseOrderStatus.COMPLETED) {

            throw new BusinessRuleException(
                    "Completed purchase orders cannot be received"
            );
        }

        if (purchaseOrder.getStatus()
                == PurchaseOrderStatus.DRAFT) {

            throw new BusinessRuleException(
                    "Purchase order must be ordered before receiving"
            );
        }

        /*
         * 4. Validate the received quantity.
         */
        if (request.receivedQuantity() <= 0) {

            throw new BusinessRuleException(
                    "Received quantity must be greater than zero"
            );
        }

        int outstandingQuantity =
                purchaseOrderLine.getQuantity()
                        - purchaseOrderLine.getReceivedQuantity();

        if (request.receivedQuantity() > outstandingQuantity) {

            throw new BusinessRuleException(
                    "Received quantity exceeds outstanding quantity. "
                            + "Outstanding quantity: "
                            + outstandingQuantity
            );
        }

        /*
         * 5. Get the product.
         */
        Product product =
                purchaseOrderLine.getProduct();

        /*
         * 6. Prevent inactive products from being received.
         */
        if (!product.isActive()) {

            throw new BusinessRuleException(
                    "Inactive products cannot be received"
            );
        }

        /*
         * 7. Find warehouse.
         */
        Warehouse warehouse =
                warehouseRepository.findById(
                        request.warehouseId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Warehouse not found"
                        )
                );

        /*
         * 8. Find location.
         */
        Location location =
                locationRepository.findById(
                        request.locationId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Location not found"
                        )
                );

        /*
         * 9. Make sure the location belongs to
         *    the selected warehouse.
         */
        if (!location.getWarehouse()
                .getId()
                .equals(warehouse.getId())) {

            throw new BusinessRuleException(
                    "Location does not belong to the selected warehouse"
            );
        }

        /*
         * 10. Get the current authenticated user.
         */
        User currentUser = getCurrentUser();

        /*
         * 11. Create or find inventory for
         *     Product + Location.
         */
        Inventory inventory =
                inventoryRepository
                        .findByProductIdAndLocationId(
                                product.getId(),
                                location.getId()
                        )
                        .orElseGet(() -> {

                            Inventory newInventory =
                                    new Inventory();

                            newInventory.setProduct(product);
                            newInventory.setLocation(location);
                            newInventory.setQuantity(0);

                            return newInventory;
                        });

        /*
         * 12. Increase inventory.
         */
        inventory.setQuantity(
                inventory.getQuantity()
                        + request.receivedQuantity()
        );

        Inventory savedInventory =
                inventoryRepository.save(inventory);

        /*
         * 13. Create stock movement.
         */
        StockMovement stockMovement =
                new StockMovement();

        stockMovement.setProduct(product);
        stockMovement.setWarehouse(warehouse);
        stockMovement.setLocation(location);
        stockMovement.setQuantity(
                request.receivedQuantity()
        );
        stockMovement.setType(
                StockMovementType.STOCK_IN
        );
        stockMovement.setReason(
                StockMovementReason.RECEIVING
        );
        stockMovement.setPerformedBy(currentUser);
        stockMovement.setMovementDate(
                LocalDateTime.now()
        );

        /*
         * Reference the receipt after the receipt
         * has been created.
         *
         * This is assigned below after saving the receipt.
         */
        StockMovement savedStockMovement =
                stockMovementRepository.save(stockMovement);

        /*
         * 14. Increase received quantity on the PO line.
         */
        purchaseOrderLine.setReceivedQuantity(
                purchaseOrderLine.getReceivedQuantity()
                        + request.receivedQuantity()
        );

        purchaseOrderLineRepository.save(
                purchaseOrderLine
        );

        /*
         * 15. Update PO status.
         */
        updatePurchaseOrderStatus(purchaseOrder);

        purchaseOrderRepository.save(
                purchaseOrder
        );

        /*
         * 16. Create receipt record.
         */
        Receipt receipt =
                new Receipt();

        receipt.setPurchaseOrder(purchaseOrder);
        receipt.setPurchaseOrderLine(purchaseOrderLine);
        receipt.setReceivedQuantity(
                request.receivedQuantity()
        );
        receipt.setWarehouse(warehouse);
        receipt.setLocation(location);
        receipt.setReceivingDate(
                request.receivingDate()
        );
        receipt.setReceivedBy(currentUser);

        Receipt savedReceipt =
                receiptRepository.save(receipt);

        /*
         * 17. Link stock movement to the receipt.
         */
        savedStockMovement.setReferenceId(
                savedReceipt.getId()
        );

        stockMovementRepository.save(
                savedStockMovement
        );

        /*
         * 18. Return the completed receipt.
         */
        return receiptMapper.toResponse(
                savedReceipt
        );
    }

    private void updatePurchaseOrderStatus(
            PurchaseOrder purchaseOrder
    ) {

        boolean fullyReceived =
                purchaseOrder.getLines()
                        .stream()
                        .allMatch(line ->
                                line.getReceivedQuantity()
                                        >= line.getQuantity()
                        );

        if (fullyReceived) {

            purchaseOrder.setStatus(
                    PurchaseOrderStatus.COMPLETED
            );

            return;
        }

        boolean partiallyReceived =
                purchaseOrder.getLines()
                        .stream()
                        .anyMatch(line ->
                                line.getReceivedQuantity() > 0
                        );

        if (partiallyReceived) {

            purchaseOrder.setStatus(
                    PurchaseOrderStatus.PARTIALLY_RECEIVED
            );
        }
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()) {

            throw new BusinessRuleException(
                    "User is not authenticated"
            );
        }

        return userRepository
                .findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Current user not found"
                        )
                );
    }

    @Transactional(readOnly = true)
    public List<ReceiptResponse> getReceipts() {

        return receiptRepository.findAll()
                .stream()
                .map(receiptMapper::toResponse)
                .toList();
    }
}