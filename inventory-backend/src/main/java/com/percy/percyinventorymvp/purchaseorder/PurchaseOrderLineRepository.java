package com.percy.percyinventorymvp.purchaseorder;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseOrderLineRepository
        extends JpaRepository<PurchaseOrderLine, Long> {
}