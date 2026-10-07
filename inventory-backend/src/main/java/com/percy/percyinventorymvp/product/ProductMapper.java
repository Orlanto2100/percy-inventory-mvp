package com.percy.percyinventorymvp.product;

import com.percy.percyinventorymvp.product.dto.ProductCreateRequest;
import com.percy.percyinventorymvp.product.dto.ProductResponse;
import com.percy.percyinventorymvp.product.dto.ProductUpdateRequest;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public Product toEntity(ProductCreateRequest request) {
        Product product = new Product();

        product.setSku(request.sku());
        product.setName(request.name());
        product.setCategory(request.category());
        product.setUnit(request.unit());
        product.setMinimumStock(request.minimumStock());

        return product;
    }

    public void updateEntity(
            Product product,
            ProductUpdateRequest request
    ) {
        product.setSku(request.sku());
        product.setName(request.name());
        product.setCategory(request.category());
        product.setUnit(request.unit());
        product.setMinimumStock(request.minimumStock());
    }

    public ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getCategory(),
                product.getUnit(),
                product.getMinimumStock(),
                product.isActive(),
                product.getCreatedDate(),
                product.getUpdatedDate()
        );
    }
}