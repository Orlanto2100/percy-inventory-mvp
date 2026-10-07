package com.percy.percyinventorymvp.stockmovement;

import com.percy.percyinventorymvp.stockmovement.dto.StockMovementResponse;
import org.springframework.stereotype.Component;

@Component
public class StockMovementMapper {

    public StockMovementResponse toResponse(
            StockMovement movement
    ) {

        return new StockMovementResponse(
                movement.getId(),

                movement.getProduct().getId(),
                movement.getProduct().getSku(),
                movement.getProduct().getName(),

                movement.getWarehouse().getId(),
                movement.getWarehouse().getName(),

                movement.getLocation().getId(),
                movement.getLocation().getCode(),
                movement.getLocation().getName(),

                movement.getQuantity(),

                movement.getType(),
                movement.getReason(),

                movement.getPerformedBy().getId(),
                movement.getPerformedBy().getUsername(),

                movement.getMovementDate(),

                movement.getReferenceId(),

                movement.getCreatedDate()
        );
    }
}