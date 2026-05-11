package com.bookstore.dto;

import com.bookstore.model.Book;
import com.bookstore.model.CartItem;

public class CartItemDto {
    private Long cartItemId;
    private Book book;
    private Integer quantity;

    public CartItemDto(Long cartItemId, Book book, Integer quantity) {
        this.cartItemId = cartItemId;
        this.book = book;
        this.quantity = quantity;
    }

    public Long getCartItemId() {
        return cartItemId;
    }

    public void setCartItemId(Long cartItemId) {
        this.cartItemId = cartItemId;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
