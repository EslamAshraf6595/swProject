// Mobile menu toggle
const menuIcon = document.getElementById("menu-icon");
const navbar = document.querySelector(".navbar");

menuIcon.addEventListener("click", () => {
  navbar.classList.toggle("active");
  menuIcon.classList.toggle("bx-x"); // Changes menu icon to 'close' icon
});

// Search box toggle
const searchIcon = document.getElementById("search-icon");
const searchBox = document.querySelector(".search-box");

searchIcon.addEventListener("click", () => {
  searchBox.classList.toggle("active");
});

// Close search box when clicking outside
document.addEventListener("click", (e) => {
  if (!searchBox.contains(e.target) && e.target !== searchIcon) {
    searchBox.classList.remove("active");
  }
});

// Sticky header on scroll
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY > 0);
});

// Add-to-cart functionality (placeholder)
const addToCartButtons = document.querySelectorAll(".products-container .box a");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent the default link action
    alert("Item added to cart!");
  });
});
