package com.percy.percyinventorymvp.location;

import com.percy.percyinventorymvp.common.exception.BusinessRuleException;
import com.percy.percyinventorymvp.common.exception.ResourceNotFoundException;
import com.percy.percyinventorymvp.location.dto.LocationCreateRequest;
import com.percy.percyinventorymvp.location.dto.LocationResponse;
import com.percy.percyinventorymvp.location.dto.LocationUpdateRequest;
import com.percy.percyinventorymvp.warehouse.Warehouse;
import com.percy.percyinventorymvp.warehouse.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LocationService {

    private final LocationRepository locationRepository;
    private final WarehouseRepository warehouseRepository;
    private final LocationMapper locationMapper;

    public LocationResponse createLocation(LocationCreateRequest request) {

        Warehouse warehouse = warehouseRepository.findById(request.warehouseId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Warehouse not found"
                        )
                );

        if (locationRepository
                .findByWarehouseIdAndCode(
                        request.warehouseId(),
                        request.code()
                )
                .isPresent()) {

            throw new BusinessRuleException(
                    "Location code already exists in this warehouse"
            );
        }

        Location location = new Location();

        location.setCode(request.code());
        location.setName(request.name());
        location.setWarehouse(warehouse);

        Location savedLocation = locationRepository.save(location);

        return locationMapper.toResponse(savedLocation);
    }

    @Transactional(readOnly = true)
    public LocationResponse getLocationById(Long id) {

        Location location = locationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Location not found"
                        )
                );

        return locationMapper.toResponse(location);
    }

    @Transactional(readOnly = true)
    public List<LocationResponse> getLocations() {

        return locationRepository.findAll()
                .stream()
                .map(locationMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LocationResponse> getLocationsByWarehouse(
            Long warehouseId
    ) {

        if (!warehouseRepository.existsById(warehouseId)) {
            throw new ResourceNotFoundException(
                    "Warehouse not found"
            );
        }

        return locationRepository.findByWarehouseId(warehouseId)
                .stream()
                .map(locationMapper::toResponse)
                .toList();
    }

    public LocationResponse updateLocation(
            Long id,
            LocationUpdateRequest request
    ) {

        Location location = locationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Location not found"
                        )
                );

        if (!location.getCode().equals(request.code())
                && locationRepository
                .findByWarehouseIdAndCode(
                        location.getWarehouse().getId(),
                        request.code()
                )
                .isPresent()) {

            throw new BusinessRuleException(
                    "Location code already exists in this warehouse"
            );
        }

        locationMapper.updateEntity(location, request);

        return locationMapper.toResponse(
                locationRepository.save(location)
        );
    }

    public LocationResponse changeLocationStatus(
            Long id,
            boolean active
    ) {

        Location location = locationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Location not found"
                        )
                );

        location.setActive(active);

        return locationMapper.toResponse(
                locationRepository.save(location)
        );
    }
}