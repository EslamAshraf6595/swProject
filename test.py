from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User

class AuthTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="password123")

    def test_login_valid_user(self):
        response = self.client.post(reverse('login'), {
            'email': 'test@example.com',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 200)

    def test_login_invalid_user(self):
        response = self.client.post(reverse('login'), {
            'email': 'wrong@example.com',
            'password': 'wrongpassword'
        })
        self.assertContains(response, "Invalid credentials", status_code=200)

    def test_signup_valid_user(self):
        response = self.client.post(reverse('signup'), {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'password456'
        })
        self.assertEqual(response.status_code, 200)
