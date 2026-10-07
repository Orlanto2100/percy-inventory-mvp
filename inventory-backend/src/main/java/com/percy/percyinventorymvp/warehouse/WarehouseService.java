package com.percy.percyinventorymvp.warehouse;

import com.percy.percyinventorymvp.common.exception.BusinessRuleException;
import com.percy.percyinventorymvp.common.exception.ResourceNotFoundException;
import com.percy.percyinventorymvp.warehouse.dto.WarehouseCreateRequest;
import com.percy.percyinventorymvp.warehouse.dto.WarehouseResponse;
import com.percy.percyinventorymvp.warehouse.dto.WarehouseUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final WarehouseMapper warehouseMapper;

    public WarehouseResponse createWarehouse(
            WarehouseCreateRequest request
    ) {
        if (warehouseRepository.findByCode(request.code()).isPresent()) {
            throw new BusinessRuleException(
                    "Warehouse code already exists"
            );
        }

        Warehouse warehouse = warehouseMapper.toEntity(request);

        Warehouse savedWarehouse = warehouseRepository.save(warehouse);

        return warehouseMapper.toResponse(savedWarehouse);
    }

    @Transactional(readOnly = true)
    public WarehouseResponse getWarehouseById(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Warehouse not found"
                        )
                );

        return warehouseMapper.toResponse(warehouse);
    }

    @Transactional(readOnly = true)
    public List<WarehouseResponse> getWarehouses() {
        return warehouseRepository.findAll()
                .stream()
                .map(warehouseMapper::toResponse)
                .toList();
    }

    public WarehouseResponse updateWarehouse(
            Long id,
            WarehouseUpdateRequest request
    ) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Warehouse not found"
                        )
                );

        if (!warehouse.getCode().equals(request.code())
                && warehouseRepository.findByCode(request.code()).isPresent()) {

            throw new BusinessRuleException(
                    "Warehouse code already exists"
            );
        }

        warehouseMapper.updateEntity(warehouse, request);

        return warehouseMapper.toResponse(
                warehouseRepository.save(warehouse)
        );
    }

    public WarehouseResponse changeWarehouseStatus(
            Long id,
            boolean active
    ) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Warehouse not found"
                        )
                );

        warehouse.setActive(active);

        return warehouseMapper.toResponse(
                warehouseRepository.save(warehouse)
        );
    }
}