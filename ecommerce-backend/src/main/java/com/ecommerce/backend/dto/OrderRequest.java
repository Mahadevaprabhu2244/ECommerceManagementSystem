package com.ecommerce.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public record OrderRequest(
        @NotBlank String customerName,
        @NotBlank @Email String email,
        String phone,
        @NotBlank String address,
        @NotEmpty List<@Valid OrderLineRequest> items
) {
    public record OrderLineRequest(
            @NotNull Long productId,
            @NotNull @Min(1) Integer quantity
    ) {}
}
