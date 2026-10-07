package com.percy.percyinventorymvp.location;

import com.percy.percyinventorymvp.common.BaseEntity;
import com.percy.percyinventorymvp.warehouse.Warehouse;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "locations",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_location_warehouse_code",
                        columnNames = {"warehouse_id", "code"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class Location extends BaseEntity {

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(nullable = false)
    private boolean active = true;
}