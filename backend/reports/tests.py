from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from decimal import Decimal
from datetime import datetime, timedelta
from transactions.models import Transaction, Category
from reports.views import ReportViewSet
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

User = get_user_model()

class ReportViewSetTestCase(APITestCase):
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

    def test_financial_summary_decimal_division(self):
        """Test that financial summary handles Decimal/float division correctly"""
        start_date = timezone.now().date().strftime('%Y-%m-%d')
        end_date = (timezone.now().date() + timedelta(days=1)).strftime('%Y-%m-%d')
        
        url = f'/api/reports/reports/financial_summary/?start_date={start_date}&end_date={end_date}'
        
        response = self.client.get(url)
        
        # Should not raise TypeError
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify the response structure
        data = response.data
        self.assertIn('summary', data)
        self.assertIn('category_breakdown', data)
        
        # Verify that percentages are calculated correctly
        summary = data['summary']
        self.assertIn('savings_rate', summary)
        self.assertIsInstance(summary['savings_rate'], (int, float))
        
        # Verify category breakdown percentages
        category_breakdown = data['category_breakdown']
        if category_breakdown:
            for item in category_breakdown:
                self.assertIn('percentage', item)
                self.assertIsInstance(item['percentage'], (int, float))
                self.assertGreaterEqual(item['percentage'], 0)
                self.assertLessEqual(item['percentage'], 100)

    def test_dashboard_stats_decimal_division(self):
        """Test that dashboard stats handles Decimal/float division correctly"""
        from transactions.views import TransactionViewSet
        
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
