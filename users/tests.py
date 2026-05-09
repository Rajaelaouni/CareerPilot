from django.test import TestCase, Client
from django.contrib.auth.models import User
import json


class AuthTests(TestCase):

    def setUp(self):
        self.client = Client()

    def test_register_user(self):
        response = self.client.post(
            "/api/auth/register",
            data=json.dumps({
                "full_name": "Test User",
                "email": "test@example.com",
                "password": "12345678"
            }),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.filter(email="test@example.com").exists())

    def test_login_user(self):
        User.objects.create_user(
            username="test@example.com",
            email="test@example.com",
            password="12345678"
        )

        response = self.client.post(
            "/api/auth/login",
            data=json.dumps({
                "email": "test@example.com",
                "password": "12345678"
            }),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)