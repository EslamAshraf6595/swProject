// --- Header Shadow on Scroll ---

// Function to toggle shadow on header when scrolling
window.onscroll = () => {
    const header = document.querySelector("header");
    if (header) {
        header.classList.toggle("shadow", window.scrollY > 0); // Add shadow class if scroll position is greater than 0
    }
};

// --- CSRF Token Fetch ---

// Function to get the CSRF token from the document
function getCSRFToken() {
    const token = document.querySelector('[name=csrfmiddlewaretoken]');
    return token ? token.value : ''; // Return CSRF token value or an empty string if not found
}

// --- Utility: Send Fetch Request ---

// Generic function to send a fetch request
async function sendFetchRequest(url, method, body) {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(), // Include CSRF token in the request
            },
            body: JSON.stringify(body), // Convert body to JSON format
        });
        return await response.json(); // Return the response in JSON format
    } catch (error) {
        console.error('Fetch Error:', error);
        alert('An error occurred. Please try again.'); // Display an error message if the fetch fails
    }
}

// --- Add to Cart Functionality ---

// Function to handle adding items to the cart
function addToCart(productId) {
    sendFetchRequest('/add_to_cart/', 'POST', { product_id: productId })
        .then(data => {
            if (data?.error) {
                alert(data.error); // Display error if there's any
            } else {
                alert(data.message || 'Product added to cart!'); // Display success message
                updateCartUIFromData(data.cart); // Updates cart UI with new data
            }
        });
}

// --- Update Cart UI ---

// Function to update the cart UI based on the cart data
function updateCartUIFromData(cart) {
    const cartCount = document.getElementById("cart-count");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (!cart || !cartItemsContainer || !cartTotal) return;

    cartItemsContainer.innerHTML = ""; // Clear existing cart items
    let totalPrice = 0;

    for (const [productId, item] of Object.entries(cart)) {
        totalPrice += item.price * item.quantity;

        const li = document.createElement("li");
        li.innerHTML = `
            ${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
            <button class="remove-btn" data-id="${productId}">Remove</button>
        `;
        cartItemsContainer.appendChild(li);
    }

    cartTotal.textContent = `$${totalPrice.toFixed(2)}`; // Display the total price
    cartCount.textContent = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0); // Update the item count

    setupRemoveButtons(); // Set up the event listeners for removing items
}

// --- Remove Items from Cart ---

// Function to set up the remove buttons and their event listeners
function setupRemoveButtons() {
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", () => {
            const productId = button.dataset.id;

            sendFetchRequest('/remove_from_cart/', 'POST', { product_id: productId })
                .then(data => {
                    if (data?.error) {
                        alert(data.error); // Display error if there's any
                    } else {
                        alert('Item removed from cart.'); // Display success message
                        updateCartUIFromData(data.cart); // Update the cart UI
                    }
                });
        });
    });
}

// --- Event Listeners for Add to Cart Buttons ---

// Function to handle click events for all 'Add to Cart' buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.dataset.id; // Get the product ID from the button's data-id attribute
        addToCart(productId); // Call the addToCart function
    });
});

// --- Main Logic for Cart Count Update ---

// Function to handle cart count update from fetch response
document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-id');
            
            fetch('/add_to_cart/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') // Include CSRF token
                },
                body: JSON.stringify({ product_id: productId })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message); // Show a confirmation message
                updateCartCount(data.cart_count); // Update the cart count in the header
            });
        });
    });

    // Utility function to get the CSRF token from cookies
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Function to update the cart count in the header
    function updateCartCount(cartCount) {
        document.getElementById('cart-count').textContent = cartCount;
    }
});
