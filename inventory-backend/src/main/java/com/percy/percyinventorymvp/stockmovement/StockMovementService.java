package com.percy.percyinventorymvp.stockmovement;

import com.percy.percyinventorymvp.common.exception.BusinessRuleException;
import com.percy.percyinventorymvp.common.exception.ResourceNotFoundException;
import com.percy.percyinventorymvp.inventory.Inventory;
import com.percy.percyinventorymvp.inventory.InventoryRepository;
import com.percy.percyinventorymvp.location.Location;
import com.percy.percyinventorymvp.location.LocationRepository;
import com.percy.percyinventorymvp.product.Product;
import com.percy.percyinventorymvp.product.ProductRepository;
import com.percy.percyinventorymvp.stockmovement.dto.AdjustmentRequest;
import com.percy.percyinventorymvp.stockmovement.dto.StockMovementResponse;
import com.percy.percyinventorymvp.stockmovement.dto.StockOutRequest;
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
public class StockMovementService {

    private final StockMovementRepository stockMovementRepository;
    private final StockMovementMapper stockMovementMapper;
    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<StockMovementResponse> getStockMovements() {

        return stockMovementRepository.findAll()
                .stream()
                .map(stockMovementMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public StockMovementResponse getStockMovementById(Long id) {

        StockMovement movement =
                stockMovementRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Stock movement not found"
                                )
                        );

        return stockMovementMapper.toResponse(movement);
    }

    @Transactional
    public StockMovementResponse stockOut(
            StockOutRequest request
    ) {

        /*
         * 1. Find product.
         */
        Product product =
                productRepository.findById(request.productId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found"
                                )
                        );

        /*
         * 2. Inactive products cannot be used
         *    in new inventory transactions.
         */
        if (!product.isActive()) {

            throw new BusinessRuleException(
                    "Inactive products cannot be used for stock out"
            );
        }

        /*
         * 3. Find warehouse.
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
         * 4. Find location.
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
         * 5. Make sure the location belongs
         *    to the selected warehouse.
         */
        if (!location.getWarehouse()
                .getId()
                .equals(warehouse.getId())) {

            throw new BusinessRuleException(
                    "Location does not belong to the selected warehouse"
            );
        }

        /*
         * 6. Only ISSUED is currently a normal
         *    stock-out reason.
         */
        if (request.reason() != StockMovementReason.ISSUED) {

            throw new BusinessRuleException(
                    "Stock out reason must be ISSUED"
            );
        }

        /*
         * 7. Find inventory for Product + Location.
         */
        Inventory inventory =
                inventoryRepository
                        .findByProductIdAndLocationId(
                                product.getId(),
                                location.getId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No inventory exists for this product and location"
                                )
                        );

        /*
         * 8. Verify sufficient inventory.
         */
        if (request.quantity() > inventory.getQuantity()) {

            throw new BusinessRuleException(
                    "Insufficient inventory. Available quantity: "
                            + inventory.getQuantity()
            );
        }

        /*
         * 9. Get authenticated user.
         */
        User currentUser = getCurrentUser();

        /*
         * 10. Decrease inventory.
         */
        inventory.setQuantity(
                inventory.getQuantity()
                        - request.quantity()
        );

        inventoryRepository.save(inventory);

        /*
         * 11. Create stock movement.
         *
         * Stock-out quantity is stored as negative.
         */
        StockMovement movement =
                new StockMovement();

        movement.setProduct(product);
        movement.setWarehouse(warehouse);
        movement.setLocation(location);

        movement.setQuantity(
                -request.quantity()
        );

        movement.setType(
                StockMovementType.STOCK_OUT
        );

        movement.setReason(
                request.reason()
        );

        movement.setPerformedBy(currentUser);

        movement.setMovementDate(
                LocalDateTime.now()
        );

        /*
         * There is no external reference for
         * a manual stock-out yet.
         */
        movement.setReferenceId(null);

        StockMovement savedMovement =
                stockMovementRepository.save(movement);

        return stockMovementMapper.toResponse(
                savedMovement
        );
    }

    @Transactional
    public StockMovementResponse adjustment(
            AdjustmentRequest request
    ) {

        /*
         * 1. Find product.
         */
        Product product =
                productRepository.findById(request.productId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found"
                                )
                        );

        /*
         * 2. Inactive products cannot be adjusted.
         */
        if (!product.isActive()) {

            throw new BusinessRuleException(
                    "Inactive products cannot be adjusted"
            );
        }

        /*
         * 3. Find warehouse.
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
         * 4. Find location.
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
         * 5. Make sure the location belongs
         *    to the selected warehouse.
         */
        if (!location.getWarehouse()
                .getId()
                .equals(warehouse.getId())) {

            throw new BusinessRuleException(
                    "Location does not belong to the selected warehouse"
            );
        }

        /*
         * 6. Adjustment cannot be zero.
         */
        if (request.quantity() == 0) {

            throw new BusinessRuleException(
                    "Adjustment quantity cannot be zero"
            );
        }

        /*
         * 7. Validate adjustment reason.
         */
        if (request.reason() != StockMovementReason.DAMAGED
                && request.reason() != StockMovementReason.LOST
                && request.reason() != StockMovementReason.FOUND
                && request.reason() != StockMovementReason.CORRECTION) {

            throw new BusinessRuleException(
                    "Invalid adjustment reason"
            );
        }

        /*
         * 8. Find inventory for Product + Location.
         */
        Inventory inventory =
                inventoryRepository
                        .findByProductIdAndLocationId(
                                product.getId(),
                                location.getId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No inventory exists for this product and location"
                                )
                        );

        /*
         * 9. Calculate the resulting quantity.
         */
        int newQuantity =
                inventory.getQuantity()
                        + request.quantity();

        /*
         * 10. Inventory can never become negative.
         */
        if (newQuantity < 0) {

            throw new BusinessRuleException(
                    "Adjustment would make inventory negative. "
                            + "Available quantity: "
                            + inventory.getQuantity()
            );
        }

        /*
         * 11. Get authenticated user.
         */
        User currentUser = getCurrentUser();

        /*
         * 12. Update inventory.
         */
        inventory.setQuantity(newQuantity);

        inventoryRepository.save(inventory);

        /*
         * 13. Create adjustment movement.
         *
         * Positive = increase
         * Negative = decrease
         */
        StockMovement movement =
                new StockMovement();

        movement.setProduct(product);
        movement.setWarehouse(warehouse);
        movement.setLocation(location);

        movement.setQuantity(
                request.quantity()
        );

        movement.setType(
                StockMovementType.ADJUSTMENT
        );

        movement.setReason(
                request.reason()
        );

        movement.setPerformedBy(currentUser);

        movement.setMovementDate(
                LocalDateTime.now()
        );

        /*
         * No external reference for a manual
         * adjustment yet.
         */
        movement.setReferenceId(null);

        StockMovement savedMovement =
                stockMovementRepository.save(movement);

        return stockMovementMapper.toResponse(
                savedMovement
        );
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
}