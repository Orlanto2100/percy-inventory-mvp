package com.percy.percyinventorymvp.stockmovement;

import com.percy.percyinventorymvp.stockmovement.dto.AdjustmentRequest;
import com.percy.percyinventorymvp.stockmovement.dto.StockMovementResponse;
import com.percy.percyinventorymvp.stockmovement.dto.StockOutRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-movements")
@RequiredArgsConstructor
public class StockMovementController {

    private final StockMovementService stockMovementService;

    @GetMapping
    public ResponseEntity<List<StockMovementResponse>> getStockMovements() {

        return ResponseEntity.ok(
                stockMovementService.getStockMovements()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockMovementResponse> getStockMovementById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                stockMovementService.getStockMovementById(id)
        );
    }

    @PostMapping("/stock-out")
    public ResponseEntity<StockMovementResponse> stockOut(
            @Valid @RequestBody StockOutRequest request
    ) {

        return ResponseEntity.ok(
                stockMovementService.stockOut(request)
        );
    }

    @PostMapping("/adjustment")
    public ResponseEntity<StockMovementResponse> adjustment(
            @Valid @RequestBody AdjustmentRequest request
    ) {

        return ResponseEntity.ok(
                stockMovementService.adjustment(request)
        );
    }
}