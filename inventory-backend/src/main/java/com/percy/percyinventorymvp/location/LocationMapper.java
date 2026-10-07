package com.percy.percyinventorymvp.location;

import com.percy.percyinventorymvp.location.dto.LocationResponse;
import com.percy.percyinventorymvp.location.dto.LocationUpdateRequest;
import org.springframework.stereotype.Component;

@Component
public class LocationMapper {

    public LocationResponse toResponse(Location location) {
        return new LocationResponse(
                location.getId(),
                location.getCode(),
                location.getName(),
                location.getWarehouse().getId(),
                location.isActive()
        );
    }

    public void updateEntity(
            Location location,
            LocationUpdateRequest request
    ) {
        location.setCode(request.code());
        location.setName(request.name());
    }
}