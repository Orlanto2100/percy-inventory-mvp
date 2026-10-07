package com.percy.percyinventorymvp.receipt;

import com.percy.percyinventorymvp.receipt.dto.ReceiptCreateRequest;
import com.percy.percyinventorymvp.receipt.dto.ReceiptResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receipts")
@RequiredArgsConstructor
public class ReceiptController {

    private final ReceiptService receiptService;

    @PostMapping
    public ResponseEntity<ReceiptResponse> createReceipt(
            @Valid @RequestBody ReceiptCreateRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        receiptService.createReceipt(request)
                );
    }

    @GetMapping
    public ResponseEntity<List<ReceiptResponse>> getReceipts() {
        return ResponseEntity.ok(
                receiptService.getReceipts()
        );
    }
}