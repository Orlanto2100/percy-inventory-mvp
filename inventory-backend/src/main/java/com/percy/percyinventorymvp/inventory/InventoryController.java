package com.percy.percyinventorymvp.inventory;

import com.percy.percyinventorymvp.inventory.dto.InventoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getInventory(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Long warehouseId,
            @RequestParam(required = false) Long locationId
    ) {
        return ResponseEntity.ok(
                inventoryService.searchInventory(
                        search,
                        productId,
                        warehouseId,
                        locationId
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryResponse> getInventoryById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                inventoryService.getInventoryById(id)
        );
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryResponse>> getLowStockInventory() {
        return ResponseEntity.ok(
                inventoryService.getLowStockInventory()
        );
    }
}