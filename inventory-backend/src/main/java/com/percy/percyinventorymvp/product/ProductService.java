package com.percy.percyinventorymvp.product;

import com.percy.percyinventorymvp.common.exception.BusinessRuleException;
import com.percy.percyinventorymvp.common.exception.ResourceNotFoundException;
import com.percy.percyinventorymvp.product.dto.ProductCreateRequest;
import com.percy.percyinventorymvp.product.dto.ProductResponse;
import com.percy.percyinventorymvp.product.dto.ProductUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductResponse createProduct(ProductCreateRequest request) {

        if (productRepository.existsBySku(request.sku())) {
            throw new BusinessRuleException("SKU already exists");
        }

        Product product = productMapper.toEntity(request);

        Product savedProduct = productRepository.save(product);

        return productMapper.toResponse(savedProduct);
    }

    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        )
                );

        return productMapper.toResponse(product);
    }

    public Page<ProductResponse> getProducts(
            String search,
            Boolean active,
            Pageable pageable
    ) {

        Page<Product> products;

        if (search != null && !search.isBlank() && active != null) {

            products = productRepository
                    .findByNameContainingIgnoreCaseAndActive(
                            search,
                            active,
                            pageable
                    );

        } else if (search != null && !search.isBlank()) {

            products = productRepository
                    .findByNameContainingIgnoreCase(
                            search,
                            pageable
                    );

        } else if (active != null) {

            products = productRepository
                    .findByActive(active, pageable);

        } else {

            products = productRepository.findAll(pageable);
        }

        return products.map(productMapper::toResponse);
    }

    public ProductResponse updateProduct(
            Long id,
            ProductUpdateRequest request
    ) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        )
                );

        if (!product.getSku().equals(request.sku())
                && productRepository.existsBySkuAndIdNot(
                request.sku(),
                id
        )) {

            throw new BusinessRuleException(
                    "SKU already exists"
            );
        }

        productMapper.updateEntity(product, request);

        Product updatedProduct = productRepository.save(product);

        return productMapper.toResponse(updatedProduct);
    }

    public ProductResponse changeProductStatus(
            Long id,
            boolean active
    ) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        )
                );

        product.setActive(active);

        Product updatedProduct = productRepository.save(product);

        return productMapper.toResponse(updatedProduct);
    }
}