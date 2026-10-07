package com.percy.percyinventorymvp.inventory;

import com.percy.percyinventorymvp.common.BaseEntity;
import com.percy.percyinventorymvp.location.Location;
import com.percy.percyinventorymvp.product.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "inventory",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"product_id", "location_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class Inventory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(nullable = false)
    private int quantity = 0;
}