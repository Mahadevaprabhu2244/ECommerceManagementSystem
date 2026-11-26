package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {
    List<CustomerOrder> findByEmailIgnoreCaseOrderByCreatedAtDesc(String email);
}
