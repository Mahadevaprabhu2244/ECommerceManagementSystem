package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String search);
    List<Product> findByCategory_Id(Long categoryId);
    List<Product> findByNameContainingIgnoreCaseAndCategory_Id(String search, Long categoryId);
}
