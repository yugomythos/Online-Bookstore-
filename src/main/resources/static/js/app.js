const app = {
    content: document.getElementById('app-content'),
    cartCountEl: document.getElementById('cart-count'),
    toastEl: document.getElementById('toast'),
    
    init() {
        this.navigate('home');
        this.updateCartCount();
    },

    async navigate(route, params = null) {
        this.content.innerHTML = '<div style="text-align:center; padding: 4rem;"><p>Loading...</p></div>';
        
        try {
            switch(route) {
                case 'home':
                    await this.renderHome(params);
                    break;
                case 'details':
                    await this.renderDetails(params);
                    break;
                case 'cart':
                    await this.renderCart();
                    break;
                default:
                    await this.renderHome();
            }
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Navigation Error:', error);
            this.showToast('Failed to load content', 'error');
        }
    },

    async renderHome(searchQuery = '') {
        const url = searchQuery ? `/api/books?search=${encodeURIComponent(searchQuery)}` : '/api/books';
        const response = await fetch(url);
        const books = await response.json();

        let html = `
            <div class="hero">
                <h2>Discover Your Next Great Read</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Explore our curated collection of premium technical and scientific literature.</p>
                <div class="search-bar">
                    <input type="text" id="searchInput" placeholder="Search by title or author..." value="${searchQuery}">
                    <button onclick="app.searchBooks()">Search</button>
                </div>
            </div>
            
            <div class="books-grid">
        `;

        if (books.length === 0) {
            html += `<div class="empty-state" style="grid-column: 1/-1;"><h3>No books found matching your criteria.</h3></div>`;
        }

        books.forEach(book => {
            html += `
                <div class="book-card" onclick="app.navigate('details', ${book.id})">
                    <img src="${book.imageUrl || 'https://via.placeholder.com/400x500?text=No+Image'}" alt="${book.title}" class="book-image">
                    <div class="book-info">
                        <h3>${book.title}</h3>
                        <p class="book-author">${book.author}</p>
                        <div class="book-footer">
                            <span class="book-price">$${book.price.toFixed(2)}</span>
                            <button class="btn btn-primary" onclick="event.stopPropagation(); app.addToCart(${book.id})">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        this.content.innerHTML = html;

        // Add enter key listener for search
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchBooks();
            }
        });
    },

    searchBooks() {
        const query = document.getElementById('searchInput').value;
        this.navigate('home', query);
    },

    async renderDetails(id) {
        const response = await fetch(`/api/books/${id}`);
        if (!response.ok) {
            this.navigate('home');
            return;
        }
        const book = await response.json();

        this.content.innerHTML = `
            <button class="btn btn-outline" style="margin-bottom: 2rem;" onclick="app.navigate('home')">← Back to Books</button>
            <div class="details-container">
                <div class="details-image">
                    <img src="${book.imageUrl || 'https://via.placeholder.com/400x500?text=No+Image'}" alt="${book.title}">
                </div>
                <div class="details-info">
                    <h2>${book.title}</h2>
                    <p class="author">By ${book.author}</p>
                    <div class="price">$${book.price.toFixed(2)}</div>
                    <p class="description">${book.description}</p>
                    <div>
                        <button class="btn btn-primary" style="font-size: 1.1rem; padding: 1rem 2rem;" onclick="app.addToCart(${book.id})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    async renderCart() {
        const response = await fetch('/api/cart');
        const cartItems = await response.json();

        let html = `
            <div class="cart-container">
                <div class="cart-header">
                    <h2>Your Shopping Cart</h2>
                </div>
        `;

        if (cartItems.length === 0) {
            html += `
                <div class="empty-state">
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added any books yet.</p>
                    <button class="btn btn-primary" style="margin-top: 2rem;" onclick="app.navigate('home')">Start Browsing</button>
                </div>
            </div>`;
            this.content.innerHTML = html;
            return;
        }

        let total = 0;
        cartItems.forEach(item => {
            const itemTotal = item.book.price * item.quantity;
            total += itemTotal;
            html += `
                <div class="cart-item">
                    <img src="${item.book.imageUrl || 'https://via.placeholder.com/100x150?text=No+Image'}" alt="${item.book.title}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h4>${item.book.title}</h4>
                        <p>${item.book.author}</p>
                        <p style="margin-top:0.5rem; font-size:0.9rem;">Qty: ${item.quantity}</p>
                    </div>
                    <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                    <button class="btn btn-danger btn-remove" onclick="app.removeFromCart(${item.cartItemId})">Remove</button>
                </div>
            `;
        });

        html += `
                <div class="cart-summary">
                    <div class="cart-total">Total: <span>$${total.toFixed(2)}</span></div>
                    <button class="btn btn-primary" style="padding: 1rem 3rem; font-size: 1.1rem;" onclick="app.checkout()">Proceed to Checkout</button>
                </div>
            </div>
        `;

        this.content.innerHTML = html;
    },

    async addToCart(bookId) {
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId })
            });

            if (response.ok) {
                this.showToast('Book added to cart!');
                this.updateCartCount();
            } else {
                this.showToast('Failed to add book', 'error');
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            this.showToast('Network error', 'error');
        }
    },

    async removeFromCart(cartItemId) {
        try {
            const response = await fetch(`/api/cart/${cartItemId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.showToast('Item removed');
                this.updateCartCount();
                this.renderCart(); // re-render
            } else {
                this.showToast('Failed to remove item', 'error');
            }
        } catch (error) {
            console.error('Remove from cart error:', error);
        }
    },

    async updateCartCount() {
        try {
            const response = await fetch('/api/cart');
            const cartItems = await response.json();
            const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            this.cartCountEl.textContent = count;
        } catch (error) {
            console.error('Error fetching cart count:', error);
        }
    },

    async checkout() {
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST'
            });

            if (response.ok) {
                const data = await response.json();
                this.showToast(data.message || 'Order placed successfully!');
                this.updateCartCount();
                this.navigate('home');
            } else {
                const errorData = await response.json();
                this.showToast(errorData.message || 'Checkout failed', 'error');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            this.showToast('Network error during checkout', 'error');
        }
    },

    showToast(message, type = 'success') {
        this.toastEl.textContent = message;
        this.toastEl.className = `toast ${type} show`;
        
        setTimeout(() => {
            this.toastEl.className = 'toast';
        }, 3000);
    }
};

// Initialize application on load
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
