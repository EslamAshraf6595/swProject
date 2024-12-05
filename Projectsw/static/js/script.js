// Tabs switching functionality
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

loginTab.addEventListener('click', () => {
    loginTab.classList.add('active-tab');
    signupTab.classList.remove('active-tab');
    loginForm.classList.add('active-form');
    signupForm.classList.remove('active-form');
});

signupTab.addEventListener('click', () => {
    signupTab.classList.add('active-tab');
    loginTab.classList.remove('active-tab');
    signupForm.classList.add('active-form');
    loginForm.classList.remove('active-form');
});
