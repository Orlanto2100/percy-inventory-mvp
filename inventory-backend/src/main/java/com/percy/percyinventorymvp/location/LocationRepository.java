package com.percy.percyinventorymvp.location;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {

    Optional<Location> findByWarehouseIdAndCode(
            Long warehouseId,
            String code
    );

    List<Location> findByWarehouseId(Long warehouseId);
}