// Handle signup form submission
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Signup successful!");
    window.location.href = "login.html"; // Redirect to login page after signup
  });
}

// Handle login form submission
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Login successful!");
    window.location.href = "home.html"; // Redirect to home page after login
  });
}
