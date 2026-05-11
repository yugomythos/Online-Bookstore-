package com.bookstore.controller;

import com.bookstore.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    @Autowired
    private CartRepository cartRepository;

    @PostMapping
    public ResponseEntity<?> checkout() {
        if (cartRepository.count() == 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cart is empty"));
        }
        
        // In a real application, we would process payment and create an order record here.
        // For this simple project, we just clear the cart and return success.
        cartRepository.deleteAllItems();
        
        return ResponseEntity.ok(Map.of("message", "Order placed successfully!"));
    }
}
