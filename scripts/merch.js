// Merch store functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize store
    initializeStore();
    
    // Cart functionality
    initializeCart();
    
    // Product filtering and sorting
    initializeFilters();
    
    // Animate products on load
    animateProducts();
});

// Store data
const products = {
    1: {
        id: 1,
        name: "Political Thunder Premium Tee",
        price: 24.99,
        originalPrice: 29.99,
        category: "apparel",
        description: "Classic fit t-shirt featuring our iconic lightning bolt logo",
        image: "fas fa-tshirt",
        sizes: ["S", "M", "L", "XL"],
        colors: ["navy", "black", "gray"]
    },
    2: {
        id: 2,
        name: "Hurricane of Hot Topics Hoodie",
        price: 39.99,
        category: "apparel",
        description: "Comfortable pullover hoodie perfect for political discourse sessions",
        image: "fas fa-user-tie",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["navy", "black", "gray"]
    },
    3: {
        id: 3,
        name: "Shade Thrower Tank Top",
        price: 22.99,
        category: "apparel",
        description: "Lightweight tank perfect for those heated political debates",
        image: "fas fa-vote-yea",
        sizes: ["S", "M", "L", "XL"],
        colors: ["navy", "black", "white"]
    },
    4: {
        id: 4,
        name: "Political Fuel Coffee Mug",
        price: 14.99,
        category: "accessories",
        description: "15oz ceramic mug for your morning political news consumption",
        image: "fas fa-coffee"
    },
    5: {
        id: 5,
        name: "Shade 4cast Baseball Cap",
        price: 18.99,
        category: "accessories",
        description: "Adjustable cap with embroidered logo - perfect for outdoor rallies",
        image: "fas fa-baseball-ball",
        colors: ["navy", "black", "khaki"]
    },
    6: {
        id: 6,
        name: "Political Thunder Poster Set",
        price: 32.99,
        category: "home",
        description: "Set of 3 motivational political posters for your home office",
        image: "fas fa-image"
    },
    7: {
        id: 7,
        name: "Shade 4cast Laptop Sleeve",
        price: 45.99,
        category: "home",
        description: "Padded laptop sleeve with our logo - perfect for political activists on the go",
        image: "fas fa-laptop",
        sizes: ["13\"", "15\"", "17\""]
    },
    8: {
        id: 8,
        name: "Throwing Shade Sticker Pack",
        price: 8.99,
        category: "stickers",
        description: "Waterproof vinyl sticker pack with 5 different political sayings",
        image: "fas fa-star"
    },
    9: {
        id: 9,
        name: "Political Lightning Car Decal",
        price: 12.99,
        category: "stickers",
        description: "Weather-resistant car decal featuring our lightning bolt logo",
        image: "fas fa-bolt"
    }
};

// Cart state
let cart = JSON.parse(localStorage.getItem('shade4cast-cart') || '[]');

// Initialize store
function initializeStore() {
    // Product option handlers
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from siblings
            this.parentElement.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
        });
    });

    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from siblings
            this.parentElement.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
        });
    });

    // Add to cart handlers
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            addToCart(productId, this);
        });
    });
}

// Initialize cart functionality
function initializeCart() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCart = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Update cart display
    updateCartDisplay();

    // Cart icon click
    cartIcon.addEventListener('click', function() {
        openCart();
    });

    // Close cart handlers
    closeCart.addEventListener('click', closeCartSidebar);
    cartOverlay.addEventListener('click', closeCartSidebar);

    // Checkout handler
    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            proceedToCheckout();
        }
    });

    // Keyboard handler for cart
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartSidebar.classList.contains('open')) {
            closeCartSidebar();
        }
    });
}

// Initialize filters
function initializeFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');

    categoryFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
}

// Add to cart function
function addToCart(productId, buttonElement) {
    const product = products[productId];
    if (!product) return;

    // Get selected options
    const productCard = buttonElement.closest('.product-card');
    const selectedSize = productCard.querySelector('.size-btn.active')?.getAttribute('data-size') || null;
    const selectedColor = productCard.querySelector('.color-btn.active')?.getAttribute('data-color') || null;

    // Create cart item
    const cartItem = {
        id: productId,
        name: product.name,
        price: product.price,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
        image: product.image,
        uniqueId: Date.now() + Math.random() // For tracking individual items
    };

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => 
        item.id === productId && 
        item.size === selectedSize && 
        item.color === selectedColor
    );

    if (existingItemIndex > -1) {
        // Increase quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item
        cart.push(cartItem);
    }

    // Save to localStorage
    localStorage.setItem('shade4cast-cart', JSON.stringify(cart));

    // Update display
    updateCartDisplay();

    // Button animation
    animateAddToCart(buttonElement);

    // Show notification
    showNotification(`${product.name} added to cart!`, 'success');
}

// Remove from cart
function removeFromCart(uniqueId) {
    cart = cart.filter(item => item.uniqueId !== uniqueId);
    localStorage.setItem('shade4cast-cart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification('Item removed from cart', 'info');
}

// Update cart quantity
function updateCartQuantity(uniqueId, change) {
    const itemIndex = cart.findIndex(item => item.uniqueId === uniqueId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            removeFromCart(uniqueId);
            return;
        }
        localStorage.setItem('shade4cast-cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.classList.toggle('show', totalItems > 0);

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <p>Add some political gear to get started!</p>
            </div>
        `;
        checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="${item.image}"></i>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    ${item.size || item.color ? `<div class="cart-item-options">
                        ${item.size ? `Size: ${item.size}` : ''}
                        ${item.size && item.color ? ', ' : ''}
                        ${item.color ? `Color: ${item.color}` : ''}
                    </div>` : ''}
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateCartQuantity('${item.uniqueId}', -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity('${item.uniqueId}', 1)">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.uniqueId}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        checkoutBtn.disabled = false;
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Open cart
function openCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close cart
function closeCartSidebar() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

// Apply filters
function applyFilters() {
    const categoryFilter = document.getElementById('category-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;

    const productCards = document.querySelectorAll('.product-card:not(.featured)');
    let visibleProducts = Array.from(productCards);

    // Category filter
    if (categoryFilter !== 'all') {
        visibleProducts = visibleProducts.filter(card => 
            card.getAttribute('data-category') === categoryFilter
        );
    }

    // Price filter
    if (priceFilter !== 'all') {
        const [min, max] = priceFilter.split('-').map(Number);
        visibleProducts = visibleProducts.filter(card => {
            const price = parseFloat(card.getAttribute('data-price'));
            return max ? (price >= min && price <= max) : price >= min;
        });
    }

    // Show/hide products
    productCards.forEach(card => {
        if (visibleProducts.includes(card)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Sort products
    if (sortFilter !== 'featured') {
        sortProducts(visibleProducts, sortFilter);
    }

    // Show message if no products found
    const productsGrid = document.querySelector('.products-grid');
    const visibleCount = visibleProducts.filter(card => card.style.display !== 'none').length;
    
    if (visibleCount === 0) {
        if (!document.querySelector('.no-products-message')) {
            const message = document.createElement('div');
            message.className = 'no-products-message';
            message.style.cssText = `
                grid-column: 1 / -1;
                text-align: center;
                padding: var(--spacing-xxl);
                color: var(--text-light);
            `;
            message.innerHTML = `
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: var(--spacing-md); opacity: 0.5;"></i>
                <p>No products found matching your criteria.</p>
                <p>Try adjusting your filters.</p>
            `;
            productsGrid.appendChild(message);
        }
    } else {
        const message = document.querySelector('.no-products-message');
        if (message) {
            message.remove();
        }
    }
}

// Sort products
function sortProducts(products, sortBy) {
    const productsGrid = document.querySelector('.products-grid');
    
    switch (sortBy) {
        case 'price-low':
            products.sort((a, b) => 
                parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'))
            );
            break;
        case 'price-high':
            products.sort((a, b) => 
                parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'))
            );
            break;
        case 'newest':
            // Simulate newest by reversing order
            products.reverse();
            break;
    }
    
    // Reorder in DOM
    products.forEach(product => {
        productsGrid.appendChild(product);
    });
}

// Animate products on load
function animateProducts() {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
}

// Animate add to cart button
function animateAddToCart(button) {
    button.classList.add('loading');
    button.disabled = true;
    
    setTimeout(() => {
        button.classList.remove('loading');
        button.disabled = false;
    }, 800);
}

// Proceed to checkout
function proceedToCheckout() {
    // In a real implementation, this would redirect to a payment processor
    showNotification('Redirecting to checkout...', 'info');
    
    setTimeout(() => {
        // Simulate checkout process
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderNumber = Math.floor(Math.random() * 1000000);
        
        showNotification(`Order #${orderNumber} placed successfully! Total: $${total.toFixed(2)}`, 'success');
        
        // Clear cart
        cart = [];
        localStorage.setItem('shade4cast-cart', JSON.stringify(cart));
        updateCartDisplay();
        closeCartSidebar();
    }, 2000);
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--accent-color)' : type === 'error' ? '#e74c3c' : 'var(--primary-color)'};
        color: ${type === 'success' ? 'var(--primary-dark)' : 'white'};
        padding: var(--spacing-md) var(--spacing-lg);
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Wishlist functionality
function addToWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('shade4cast-wishlist') || '[]');
    
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('shade4cast-wishlist', JSON.stringify(wishlist));
        showNotification('Added to wishlist!', 'success');
    } else {
        showNotification('Already in wishlist!', 'info');
    }
}

// Size guide functionality
function showSizeGuide() {
    // In a real implementation, this would show a modal with size information
    showNotification('Size guide: S(34-36"), M(38-40"), L(42-44"), XL(46-48")', 'info');
}

// Export functions to global scope for onclick handlers
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.addToWishlist = addToWishlist;
window.showSizeGuide = showSizeGuide;