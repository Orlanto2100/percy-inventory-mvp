package com.percy.percyinventorymvp.warehouse;

import com.percy.percyinventorymvp.warehouse.dto.WarehouseCreateRequest;
import com.percy.percyinventorymvp.warehouse.dto.WarehouseResponse;
import com.percy.percyinventorymvp.warehouse.dto.WarehouseUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
@RequiredArgsConstructor
public class WarehouseController {

    private final WarehouseService warehouseService;

    @PostMapping
    public ResponseEntity<WarehouseResponse> createWarehouse(
            @Valid @RequestBody WarehouseCreateRequest request
    ) {
        WarehouseResponse response =
                warehouseService.createWarehouse(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<WarehouseResponse>> getWarehouses() {

        return ResponseEntity.ok(
                warehouseService.getWarehouses()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<WarehouseResponse> getWarehouseById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                warehouseService.getWarehouseById(id)
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<WarehouseResponse> updateWarehouse(
            @PathVariable Long id,
            @Valid @RequestBody WarehouseUpdateRequest request
    ) {
        return ResponseEntity.ok(
                warehouseService.updateWarehouse(id, request)
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<WarehouseResponse> changeWarehouseStatus(
            @PathVariable Long id,
            @RequestParam boolean active
    ) {
        return ResponseEntity.ok(
                warehouseService.changeWarehouseStatus(id, active)
        );
    }
}