window.onscroll = () => {
    let header = document.querySelector("header");
    header.classList.toggle("shadow", window.scrollY > 0);
};

document.querySelector("#search-icon").onclick = () => {
    document.querySelector(".search-box").classList.toggle("active");
};
document.querySelector("#menu-icon").onclick = () => {
    document.querySelector(".navbar").classList.toggle("active");
};
document.getElementById('search-icon').addEventListener('click', function() {
    document.querySelector('.search-box').classList.toggle('active');
  });


  function addToCart(productId) {
    fetch('/add-to-cart/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        updateCartUIFromData(data.cart);
    })
    .catch(error => console.error('Error:', error));
}

// main.js
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        const productId = this.dataset.id;
        fetch('/add_to_cart/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({product_id: productId})
        }).then(response => response.json())
          .then(data => {
              alert('Product added to cart!');
              document.getElementById('cart-count').innerText = Object.keys(data.cart).length;
          });
    });
});
