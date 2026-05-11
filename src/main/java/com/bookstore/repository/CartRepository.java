package com.bookstore.repository;

import com.bookstore.model.CartItem;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends CrudRepository<CartItem, Long> {

    @Query("SELECT * FROM cart_items WHERE book_id = :bookId")
    CartItem findByBookId(@Param("bookId") Long bookId);

    @Modifying
    @Query("DELETE FROM cart_items")
    void deleteAllItems();
}
