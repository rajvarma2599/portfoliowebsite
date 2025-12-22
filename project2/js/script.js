// Mock product data
const products = [
    { id: 1, name: 'Wireless Headphones', price: 99.99, image: 'https://via.placeholder.com/300x200', description: 'High-quality wireless headphones with noise cancellation.' },
    { id: 2, name: 'Smart Watch', price: 199.99, image: 'https://via.placeholder.com/300x200', description: 'Fitness tracking smartwatch with heart rate monitor.' },
    { id: 3, name: 'Laptop Stand', price: 49.99, image: 'https://via.placeholder.com/300x200', description: 'Adjustable laptop stand for better ergonomics.' },
    { id: 4, name: 'Bluetooth Speaker', price: 79.99, image: 'https://via.placeholder.com/300x200', description: 'Portable Bluetooth speaker with 360-degree sound.' },
    { id: 5, name: 'Gaming Mouse', price: 59.99, image: 'https://via.placeholder.com/300x200', description: 'High-precision gaming mouse with RGB lighting.' },
    { id: 6, name: 'USB-C Hub', price: 39.99, image: 'https://via.placeholder.com/300x200', description: 'Multi-port USB-C hub for laptops and tablets.' }
];

let cart = [];
let cartCount = 0;

// DOM elements
const productsGrid = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');
const cartCountEl = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const closeBtn = document.querySelector('.close');
const checkoutBtn = document.getElementById('checkout-btn');

// Initialize the app
function init() {
    displayProducts();
    updateCartCount();
}

// Display products
function displayProducts() {
    productsGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">$${product.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button class="btn-secondary" onclick="addToCart(${product.id})">Add to Cart</button>
                    <button class="btn-primary" onclick="viewProduct(${product.id})">View Details</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    updateCartDisplay();
    showNotification(`${product.name} added to cart!`);
}

// Update cart count
function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountEl.textContent = cartCount;
}

// Update cart display
function updateCartDisplay() {
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-total">
                <p>$${itemTotal.toFixed(2)}</p>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = total.toFixed(2);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartDisplay();
}

// View product details
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    alert(`Product: ${product.name}\nPrice: $${product.price.toFixed(2)}\nDescription: ${product.description}`);
}

// Show notification
function showNotification(message) {
    // Simple notification - in a real app, you'd use a proper notification system
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem;
        border-radius: 5px;
        z-index: 1000;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Event listeners
cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
    } else {
        alert('Checkout functionality would be implemented here.');
        cart = [];
        updateCartCount();
        updateCartDisplay();
        cartModal.style.display = 'none';
    }
});

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
