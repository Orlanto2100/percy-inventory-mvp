package com.percy.percyinventorymvp.location;

import com.percy.percyinventorymvp.location.dto.LocationCreateRequest;
import com.percy.percyinventorymvp.location.dto.LocationResponse;
import com.percy.percyinventorymvp.location.dto.LocationUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @PostMapping
    public ResponseEntity<LocationResponse> createLocation(
            @Valid @RequestBody LocationCreateRequest request
    ) {
        LocationResponse response =
                locationService.createLocation(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<LocationResponse>> getLocations() {
        return ResponseEntity.ok(
                locationService.getLocations()
        );
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<LocationResponse>> getLocationsByWarehouse(
            @PathVariable Long warehouseId
    ) {
        return ResponseEntity.ok(
                locationService.getLocationsByWarehouse(warehouseId)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocationResponse> getLocationById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                locationService.getLocationById(id)
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<LocationResponse> updateLocation(
            @PathVariable Long id,
            @Valid @RequestBody LocationUpdateRequest request
    ) {
        return ResponseEntity.ok(
                locationService.updateLocation(id, request)
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<LocationResponse> changeLocationStatus(
            @PathVariable Long id,
            @RequestParam boolean active
    ) {
        return ResponseEntity.ok(
                locationService.changeLocationStatus(id, active)
        );
    }
}