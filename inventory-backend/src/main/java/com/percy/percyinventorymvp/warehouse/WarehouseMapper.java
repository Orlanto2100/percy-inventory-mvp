package com.percy.percyinventorymvp.warehouse;

import com.percy.percyinventorymvp.warehouse.dto.WarehouseCreateRequest;
import com.percy.percyinventorymvp.warehouse.dto.WarehouseResponse;
import com.percy.percyinventorymvp.warehouse.dto.WarehouseUpdateRequest;
import org.springframework.stereotype.Component;

@Component
public class WarehouseMapper {

    public Warehouse toEntity(WarehouseCreateRequest request) {
        Warehouse warehouse = new Warehouse();

        warehouse.setCode(request.code());
        warehouse.setName(request.name());
        warehouse.setAddress(request.address());
        warehouse.setCity(request.city());
        warehouse.setPhone(request.phone());
        warehouse.setEmail(request.email());

        return warehouse;
    }

    public void updateEntity(
            Warehouse warehouse,
            WarehouseUpdateRequest request
    ) {
        warehouse.setCode(request.code());
        warehouse.setName(request.name());
        warehouse.setAddress(request.address());
        warehouse.setCity(request.city());
        warehouse.setPhone(request.phone());
        warehouse.setEmail(request.email());
    }

    public WarehouseResponse toResponse(Warehouse warehouse) {
        return new WarehouseResponse(
                warehouse.getId(),
                warehouse.getCode(),
                warehouse.getName(),
                warehouse.getAddress(),
                warehouse.getCity(),
                warehouse.getPhone(),
                warehouse.getEmail(),
                warehouse.isActive()
        );
    }
}