package com.percy.percyinventorymvp.inventory;

import com.percy.percyinventorymvp.common.exception.ResourceNotFoundException;
import com.percy.percyinventorymvp.inventory.dto.InventoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryMapper inventoryMapper;

    public InventoryResponse getInventoryById(Long id) {

        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Inventory not found"
                        )
                );

        return inventoryMapper.toResponse(inventory);
    }

    public List<InventoryResponse> getInventory() {

        return inventoryRepository.findAll()
                .stream()
                .map(inventoryMapper::toResponse)
                .toList();
    }

    public List<InventoryResponse> searchInventory(
            String search,
            Long productId,
            Long warehouseId,
            Long locationId
    ) {

        return inventoryRepository.searchInventory(
                        search,
                        productId,
                        warehouseId,
                        locationId
                )
                .stream()
                .map(inventoryMapper::toResponse)
                .toList();
    }

    public List<InventoryResponse> getLowStockInventory() {

        return inventoryRepository.findLowStockInventory()
                .stream()
                .map(inventoryMapper::toResponse)
                .toList();
    }
}