from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from decimal import Decimal
from datetime import datetime, timedelta
from transactions.models import Transaction, Category
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

User = get_user_model()

class TransactionViewSetTestCase(APITestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Create a test category
        self.category = Category.objects.create(
            name='Test Category',
            user=self.user
        )
        
        # Create test transactions with Decimal amounts
        self.transaction1 = Transaction.objects.create(
            user=self.user,
            amount=Decimal('100.00'),
            description='Test Income',
            category=self.category,
            transaction_type='INCOME',
            date=timezone.now().date()
        )
        
        self.transaction2 = Transaction.objects.create(
            user=self.user,
            amount=Decimal('50.00'),
            description='Test Expense',
            category=self.category,
            transaction_type='EXPENSE',
            date=timezone.now().date()
        )
        
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_dashboard_stats_decimal_division(self):
        """Test that dashboard stats handles Decimal/float division correctly"""
        url = '/api/transactions/transactions/dashboard_stats/'
        response = self.client.get(url)
        
        # Should not raise TypeError
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify the response structure
        data = response.data
        self.assertIn('statistics', data)
        
        # Verify that savings_rate is calculated correctly
        statistics = data['statistics']
        self.assertIn('savings_rate', statistics)
        self.assertIsInstance(statistics['savings_rate'], (int, float))
        
        # Verify that all monetary values are floats
        self.assertIsInstance(statistics['total_income'], float)
        self.assertIsInstance(statistics['total_expenses'], float)
        self.assertIsInstance(statistics['net_balance'], float)

    def test_category_stats_decimal_division(self):
        """Test that category stats handles Decimal/float division correctly"""
        url = '/api/transactions/transactions/category_stats/'
        response = self.client.get(url)
        
        # Should not raise TypeError
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify the response structure
        data = response.data
        self.assertIn('categories', data)
        
        # Verify that category amounts are floats
        categories = data['categories']
        if categories:
            for category in categories:
                self.assertIsInstance(category['income'], float)
                self.assertIsInstance(category['expenses'], float)
