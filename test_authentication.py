from django.test import TestCase
from django.urls import reverse

class AuthenticationTests(TestCase):

    def setUp(self):
        # Set up initial user data
        self.signup_url = reverse('signup')
        self.login_url = reverse('login')
        self.user_data = {
            'username': 'Test User',
            'email': 'testuser@example.com',
            'password': 'password123'
        }

    def test_signup(self):
        # Test signup functionality
        response = self.client.post(self.signup_url, self.user_data)
        self.assertEqual(response.status_code, 302)  # Redirect to login
        self.assertIn(self.user_data['email'], users_data)
        self.assertEqual(users_data[self.user_data['email']]['username'], self.user_data['username'])

    def test_login(self):
        # Sign up the user first
        self.client.post(self.signup_url, self.user_data)
        
        # Test login functionality
        response = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        })
        self.assertEqual(response.status_code, 302)  # Redirect to home
        self.assertEqual(response.url, reverse('home'))

    def test_invalid_login(self):
        # Test login with invalid credentials
        response = self.client.post(self.login_url, {
            'email': 'wrong@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 200)  # Stays on login page
        self.assertContains(response, "Invalid email or password. Please try again.")
