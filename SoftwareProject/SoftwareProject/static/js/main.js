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

        if (!productName || !productPrice || !productImage) {
            alert("Missing product details.");
            return;
        }

        const payload = {
            product_name: productName,
            product_price: productPrice,
            product_image: productImage
        };

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
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert(data.message || "Product added to cart!");
                    document.getElementById('cart-count').innerText = data.cart_count || 0;
                } else {
                    alert(data.error || "Failed to add product to cart.");
                }
            })
            .catch(error => {
                console.error("Error adding product to cart:", error);
                alert("An error occurred while adding the product.");
            });
    });
});

// Function to update the cart UI
function updateCartUIFromData(cart) {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    if (!cartItemsContainer || !cartTotal || !cartCount) return;

    cartItemsContainer.innerHTML = ""; // Clear existing items
    let totalPrice = 0;

    // Populate the cart with updated items
    for (const [productId, item] of Object.entries(cart)) {
        totalPrice += item.price * item.quantity;

        const itemRow = document.createElement("tr");
        itemRow.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" class="cart-image"></td>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><button class="remove-btn" data-id="${productId}">Remove</button></td>
        `;
        cartItemsContainer.appendChild(itemRow);
    }

    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    cartCount.textContent = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

    setupRemoveButtons(); // Reattach remove button event listeners
}

// Function to handle removing items from the cart
function setupRemoveButtons() {
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", function () {
            const productId = this.dataset.id;

            // Send a POST request to decrease quantity
            fetch('/remove_from_cart/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({ product_id: productId }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        alert(data.message || "Item updated in cart.");
                        updateCartUIFromData(data.cart); // Dynamically update the cart UI
                    } else {
                        alert(data.error || "Failed to update cart.");
                    }
                })
                .catch(error => {
                    console.error("Error removing item:", error);
                    alert("An error occurred while removing the item.");
                });
        });
    });
}

// Ensure cart buttons are initialized when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("Page Loaded. Buttons are ready.");
    setupRemoveButtons(); // Initialize remove buttons on page load
});
