/* =========================================================
   SHOPPING CART FUNCTIONALITY (cart.js)
   (Fixed with correct quotes)
========================================================= */

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- Core Cart Logic ---

    // Function to get the cart from localStorage
    function getCart() {
        return JSON.parse(localStorage.getItem('refurbECart')) || [];
    }

    // Function to save the cart to localStorage
    function saveCart(cart) {
        localStorage.setItem('refurbECart', JSON.stringify(cart));
    }

    // Function to add an item to the cart
    function addToCart(item) {
        const cart = getCart();
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.push(item);
        }
        
        saveCart(cart);
        alert(`${item.name} has been added to your cart!`);
    }

    // Function to remove an item from the cart
    function removeFromCart(itemId) {
        let cart = getCart();
        cart = cart.filter(item => item.id !== itemId); // Filter out the item
        saveCart(cart);
        renderCartItems(); // Re-render the cart
    }

    // Function to update item quantity
    function updateQuantity(itemId, quantity) {
        let cart = getCart();
        const item = cart.find(cartItem => cartItem.id === itemId);
        
        if (item) {
            item.quantity = parseInt(quantity, 10);
            if (item.quantity <= 0) {
                removeFromCart(itemId);
                return; 
            }
        }
        
        saveCart(cart);
        renderCartItems(); // Re-render the cart
    }

    // --- Page-Specific Event Listeners ---

    // 1. For product-details.html and products.html
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            const image = button.dataset.image;
            
            let quantity = 1;
            const quantityInput = document.getElementById('product-quantity');
            if (quantityInput) {
                quantity = parseInt(quantityInput.value, 10);
            }

            const item = { id, name, price, image, quantity };
            addToCart(item);
        });
    });


    // 2. For cart.html
    const cartItemsBody = document.getElementById('cart-items-body');
    if (cartItemsBody) {
        renderCartItems(); // Render the cart on page load
        
        cartItemsBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item')) {
                const itemId = e.target.dataset.id;
                removeFromCart(itemId);
            }
        });

        cartItemsBody.addEventListener('change', (e) => {
            if (e.target.classList.contains('cart-quantity')) {
                const itemId = e.target.dataset.id;
                const newQuantity = e.target.value;
                updateQuantity(itemId, newQuantity);
            }
        });
    }

    // Function to render all cart items on the cart.html page
    function renderCart() {
        const cart = JSON.parse(localStorage.getItem("refurbECart")) || [];
        const cartItemsContainer = document.querySelector(".cart-items");
        cartItemsContainer.innerHTML = "";

        cart.forEach((item, index) => {
            const cartItemHTML = `
                <div class="cart-item">
                    <img src="${item.image}">
                    <div class="cart-info">
                        <p>${item.name}</p>
                        <small>Price: ₱${Number(item.price).toFixed(2)}</small><br>
                        
                        ${item.sellerName ? `
                            <button class="msg-seller-btn" data-index="${index}">
                                Message Seller
                            </button>
                        ` : ``}

                        <a href="#" class="remove" data-index="${index}">Remove</a>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML("beforeend", cartItemHTML);
        });

        attachCartEvents();
    }

});