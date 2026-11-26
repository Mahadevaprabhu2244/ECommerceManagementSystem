package com.ecommerce.backend.config;

import com.ecommerce.backend.entity.Category;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedData(CategoryRepository categories, ProductRepository products) {
        return args -> {
            if (categories.count() == 0) {
                categories.save(new Category("Electronics", "Smart devices and accessories"));
                categories.save(new Category("Fashion", "Clothing and personal style"));
                categories.save(new Category("Home", "Useful products for your home"));
                categories.save(new Category("Accessories", "Everyday essentials"));
            }

            if (products.count() == 0) {
                Category electronics = categories.findAll().stream()
                        .filter(c -> c.getName().equals("Electronics")).findFirst().orElseThrow();
                Category fashion = categories.findAll().stream()
                        .filter(c -> c.getName().equals("Fashion")).findFirst().orElseThrow();
                Category home = categories.findAll().stream()
                        .filter(c -> c.getName().equals("Home")).findFirst().orElseThrow();
                Category accessories = categories.findAll().stream()
                        .filter(c -> c.getName().equals("Accessories")).findFirst().orElseThrow();

                products.save(product("Wireless Headphones", "Immersive sound with a comfortable over-ear fit.",
                        "3499.00", "https://images.unsplash.com/photo-150", 18, electronics));
                products.save(product("Minimal Watch", "A clean everyday watch with a timeless design.",
                        "2499.00", "https://images.unsplash.com/photo-1523275335684-37898b6baf30", 14, accessories));
                products.save(product("Classic Sneakers", "Versatile sneakers for everyday movement.",
                        "2999.00", "https://images.unsplash.com/photo-1542291026-7eec264c27ff", 20, fashion));
                products.save(product("Desk Lamp", "Warm adjustable lighting for your workspace.",
                        "1599.00", "https://images.unsplash.com/photo-1502979932800-33d311b7ce56", 9, home));
                products.save(product("Leather Backpack", "A practical backpack with a premium finish.",
                        "2799.00", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62", 11, fashion));
                products.save(product("Smart Speaker", "Compact speaker for music and daily routines.",
                        "4299.00", "https://images.unsplash.com/photo-1589003077984-894e133d", 7, electronics));
            }
        };
    }

    private Product product(String name, String description, String price, String imageUrl,
                            int stock, Category category) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(description);
        p.setPrice(new BigDecimal(price));
        p.setImageUrl(imageUrl);
        p.setStock(stock);
        p.setCategory(category);
        return p;
    }
}
