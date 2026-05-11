package com.bookstore.controller;

import com.bookstore.dto.CartItemDto;
import com.bookstore.model.Book;
import com.bookstore.model.CartItem;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private BookRepository bookRepository;

    @GetMapping
    public List<CartItemDto> getCart() {
        List<CartItemDto> cartDtoList = new ArrayList<>();
        Iterable<CartItem> cartItems = cartRepository.findAll();
        
        for (CartItem item : cartItems) {
            Optional<Book> bookOpt = bookRepository.findById(item.getBookId());
            if (bookOpt.isPresent()) {
                cartDtoList.add(new CartItemDto(item.getId(), bookOpt.get(), item.getQuantity()));
            }
        }
        return cartDtoList;
    }

    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Long> payload) {
        Long bookId = payload.get("bookId");
        if (bookId == null) {
            return ResponseEntity.badRequest().body("bookId is required");
        }

        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (!bookOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Book not found");
        }

        CartItem existingItem = cartRepository.findByBookId(bookId);
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + 1);
            cartRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem(null, bookId, 1);
            cartRepository.save(newItem);
        }

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long id) {
        if (cartRepository.existsById(id)) {
            cartRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
