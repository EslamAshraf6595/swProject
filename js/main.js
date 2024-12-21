// Add shadow to header on scroll
window.onscroll = () => {
    const header = document.querySelector("header");
    if (header) {
        header.classList.toggle("shadow", window.scrollY > 0);
    }
};


// Toggle search box visibility
document.querySelector("#search-icon")?.addEventListener("click", () => {
    document.querySelector(".search-box")?.classList.toggle("active");
});

// Toggle navbar menu visibility
document.querySelector("#menu-icon")?.addEventListener("click", () => {
    document.querySelector(".navbar")?.classList.toggle("active");
});

// Helper function to get CSRF token from cookies
function getCSRFToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith('csrftoken=')) {
                cookieValue = decodeURIComponent(cookie.substring('csrftoken='.length));
                break;
            }
        }
    }
    return cookieValue;
}

// Function to handle adding items to the cart
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', function () {
    const productName = this.dataset.name;
    const productPrice = this.dataset.price;
    const productImage = this.dataset.image;

    console.log("Button Dataset:", this.dataset);
    console.log("Product Name:", productName);
    console.log("Product Price:", productPrice);
    console.log("Product Image:", productImage);

    // If any are missing, bail out:
    if (!productName || !productPrice || !productImage) {
      alert("Missing product details.");
      return;
    }

    const payload = {
      product_name: productName,
      product_price: productPrice,
      product_image: productImage
    };
        console.log("Request Payload:", payload);

        // Send the fetch request to add the product to the cart
        fetch('/add_to_cart/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                console.error("Fetch Error:", response);
                return response.json().then(data => {
                    console.error("Error Response Data:", data);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("Server Response:", data);
            if (data.success) {
                alert(data.message || "Product added to cart!");
                document.getElementById('cart-count').innerText = data.cart_count || 0;
            } else {
                alert(data.error || "Failed to add product to cart.");
            }
        })
        .catch(error => {
            console.error("Fetch Error:", error);
        });
    });
});

// Function to update the cart UI
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

    cartTotal.textContent = `$${totalPrice.toFixed(2)}`; // Update total price
    cartCount.textContent = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0); // Update cart count

    setupRemoveButtons(); // Add event listeners for remove buttons
}

// Function to set up remove buttons for cart items
function setupRemoveButtons() {
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", () => {
            const productId = button.dataset.id;

            fetch('/remove_from_cart/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                body: JSON.stringify({ product_id: productId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Item removed from cart.");
                    updateCartUIFromData(data.cart);
                } else {
                    alert(data.error || "Failed to remove item from cart.");
                }
            })
            .catch(error => {
                console.error("Error removing item:", error);
            });
        });
    });
}

// Update cart count when the page loads (if necessary)
document.addEventListener('DOMContentLoaded', () => {
    console.log("Page Loaded. Add-to-cart buttons are ready.");
});
