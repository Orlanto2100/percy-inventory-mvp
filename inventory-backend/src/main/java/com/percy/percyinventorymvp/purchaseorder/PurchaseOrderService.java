package com.percy.percyinventorymvp.purchaseorder;

import com.percy.percyinventorymvp.common.exception.BusinessRuleException;
import com.percy.percyinventorymvp.common.exception.ResourceNotFoundException;
import com.percy.percyinventorymvp.product.Product;
import com.percy.percyinventorymvp.product.ProductRepository;
import com.percy.percyinventorymvp.purchaseorder.dto.PurchaseOrderCreateRequest;
import com.percy.percyinventorymvp.purchaseorder.dto.PurchaseOrderLineRequest;
import com.percy.percyinventorymvp.purchaseorder.dto.PurchaseOrderResponse;
import com.percy.percyinventorymvp.purchaseorder.dto.PurchaseOrderUpdateRequest;
import com.percy.percyinventorymvp.user.User;
import com.percy.percyinventorymvp.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PurchaseOrderMapper purchaseOrderMapper;

    @Transactional
    public PurchaseOrderResponse createPurchaseOrder(
            PurchaseOrderCreateRequest request
    ) {

        if (purchaseOrderRepository
                .findByPoNumber(request.poNumber())
                .isPresent()) {

            throw new BusinessRuleException(
                    "PO number already exists"
            );
        }

        User currentUser = getCurrentUser();

        PurchaseOrder purchaseOrder = new PurchaseOrder();

        purchaseOrder.setPoNumber(request.poNumber());
        purchaseOrder.setSupplier(request.supplier());
        purchaseOrder.setCreatedBy(currentUser);
        purchaseOrder.setOrderDate(request.orderDate());
        purchaseOrder.setExpectedDeliveryDate(
                request.expectedDeliveryDate()
        );
        purchaseOrder.setNotes(request.notes());
        purchaseOrder.setStatus(PurchaseOrderStatus.DRAFT);

        addLines(purchaseOrder, request.lines());
        calculateTotals(purchaseOrder);

        PurchaseOrder savedPurchaseOrder =
                purchaseOrderRepository.save(purchaseOrder);

        return purchaseOrderMapper.toResponse(savedPurchaseOrder);
    }

    @Transactional(readOnly = true)
    public PurchaseOrderResponse getPurchaseOrderById(Long id) {

        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Purchase order not found"
                        )
                );

        return purchaseOrderMapper.toResponse(purchaseOrder);
    }

    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> getPurchaseOrders() {

        return purchaseOrderRepository.findAll()
                .stream()
                .map(purchaseOrderMapper::toResponse)
                .toList();
    }

    @Transactional
    public PurchaseOrderResponse updatePurchaseOrder(
            Long id,
            PurchaseOrderUpdateRequest request
    ) {

        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Purchase order not found"
                        )
                );

        if (purchaseOrder.getStatus() != PurchaseOrderStatus.DRAFT) {
            throw new BusinessRuleException(
                    "Only draft purchase orders can be edited"
            );
        }

        purchaseOrder.setSupplier(request.supplier());
        purchaseOrder.setOrderDate(request.orderDate());
        purchaseOrder.setExpectedDeliveryDate(
                request.expectedDeliveryDate()
        );
        purchaseOrder.setNotes(request.notes());

        purchaseOrder.getLines().clear();

        addLines(purchaseOrder, request.lines());
        calculateTotals(purchaseOrder);

        return purchaseOrderMapper.toResponse(
                purchaseOrderRepository.save(purchaseOrder)
        );
    }

    @Transactional
    public PurchaseOrderResponse orderPurchaseOrder(Long id) {

        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Purchase order not found"
                        )
                );

        if (purchaseOrder.getStatus() != PurchaseOrderStatus.DRAFT) {
            throw new BusinessRuleException(
                    "Only draft purchase orders can be ordered"
            );
        }

        if (purchaseOrder.getLines().isEmpty()) {
            throw new BusinessRuleException(
                    "Purchase order must contain at least one line"
            );
        }

        purchaseOrder.setStatus(PurchaseOrderStatus.ORDERED);

        return purchaseOrderMapper.toResponse(
                purchaseOrderRepository.save(purchaseOrder)
        );
    }

    @Transactional
    public PurchaseOrderResponse cancelPurchaseOrder(Long id) {

        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Purchase order not found"
                        )
                );

        if (purchaseOrder.getStatus() == PurchaseOrderStatus.COMPLETED) {
            throw new BusinessRuleException(
                    "Completed purchase orders cannot be cancelled"
            );
        }

        if (purchaseOrder.getStatus() == PurchaseOrderStatus.CANCELLED) {
            throw new BusinessRuleException(
                    "Purchase order is already cancelled"
            );
        }

        purchaseOrder.setStatus(PurchaseOrderStatus.CANCELLED);

        return purchaseOrderMapper.toResponse(
                purchaseOrderRepository.save(purchaseOrder)
        );
    }

    private void addLines(
            PurchaseOrder purchaseOrder,
            List<PurchaseOrderLineRequest> lineRequests
    ) {

        if (lineRequests == null || lineRequests.isEmpty()) {
            throw new BusinessRuleException(
                    "Purchase order must contain at least one line"
            );
        }

        Set<Long> productIds = new HashSet<>();

        for (PurchaseOrderLineRequest request : lineRequests) {

            if (!productIds.add(request.productId())) {
                throw new BusinessRuleException(
                        "A product cannot appear more than once in a purchase order"
                );
            }

            Product product = productRepository.findById(request.productId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Product not found: "
                                            + request.productId()
                            )
                    );

            if (!product.isActive()) {
                throw new BusinessRuleException(
                        "Inactive products cannot be added to purchase orders"
                );
            }

            if (request.quantity() <= 0) {
                throw new BusinessRuleException(
                        "Quantity must be greater than zero"
                );
            }

            if (request.unitPrice() == null
                    || request.unitPrice().compareTo(BigDecimal.ZERO) <= 0) {

                throw new BusinessRuleException(
                        "Unit price must be greater than zero"
                );
            }

            PurchaseOrderLine line = new PurchaseOrderLine();

            line.setPurchaseOrder(purchaseOrder);
            line.setProduct(product);
            line.setQuantity(request.quantity());
            line.setReceivedQuantity(0);
            line.setUnitPrice(request.unitPrice());

            BigDecimal lineTotal = request.unitPrice()
                    .multiply(BigDecimal.valueOf(request.quantity()));

            line.setLineTotal(lineTotal);

            purchaseOrder.getLines().add(line);
        }
    }

    private void calculateTotals(PurchaseOrder purchaseOrder) {

        int totalQuantity = 0;
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (PurchaseOrderLine line : purchaseOrder.getLines()) {

            totalQuantity += line.getQuantity();

            totalAmount = totalAmount.add(
                    line.getLineTotal()
            );
        }

        purchaseOrder.setTotalQuantity(totalQuantity);
        purchaseOrder.setTotalAmount(totalAmount);
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()) {

            throw new BusinessRuleException(
                    "User is not authenticated"
            );
        }

        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Current user not found"
                        )
                );
    }
}