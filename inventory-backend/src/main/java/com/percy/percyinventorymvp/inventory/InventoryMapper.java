package com.percy.percyinventorymvp.inventory;

import com.percy.percyinventorymvp.inventory.dto.InventoryResponse;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {

    public InventoryResponse toResponse(Inventory inventory) {

        return new InventoryResponse(
                inventory.getId(),
                inventory.getProduct().getId(),
                inventory.getProduct().getSku(),
                inventory.getProduct().getName(),
                inventory.getLocation().getWarehouse().getId(),
                inventory.getLocation().getWarehouse().getName(),
                inventory.getLocation().getId(),
                inventory.getLocation().getCode(),
                inventory.getLocation().getName(),
                inventory.getQuantity()
        );
    }
}