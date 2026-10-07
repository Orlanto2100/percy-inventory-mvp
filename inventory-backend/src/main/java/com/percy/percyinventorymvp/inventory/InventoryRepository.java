package com.percy.percyinventorymvp.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByProductIdAndLocationId(
            Long productId,
            Long locationId
    );

    @Query("""
            SELECT i
            FROM Inventory i
            JOIN i.product p
            JOIN i.location l
            JOIN l.warehouse w
            WHERE
                (:search IS NULL OR
                 LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%')) OR
                 LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR
                 LOWER(l.code) LIKE LOWER(CONCAT('%', :search, '%')) OR
                 LOWER(l.name) LIKE LOWER(CONCAT('%', :search, '%')) OR
                 LOWER(w.code) LIKE LOWER(CONCAT('%', :search, '%')) OR
                 LOWER(w.name) LIKE LOWER(CONCAT('%', :search, '%')))
            AND (:productId IS NULL OR p.id = :productId)
            AND (:warehouseId IS NULL OR w.id = :warehouseId)
            AND (:locationId IS NULL OR l.id = :locationId)
            """)
    List<Inventory> searchInventory(
            @Param("search") String search,
            @Param("productId") Long productId,
            @Param("warehouseId") Long warehouseId,
            @Param("locationId") Long locationId
    );

    @Query("""
            SELECT i
            FROM Inventory i
            WHERE i.quantity < i.product.minimumStock
            """)
    List<Inventory> findLowStockInventory();
}