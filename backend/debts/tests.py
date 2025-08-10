from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from decimal import Decimal
from datetime import date, timedelta
import json

from .models import DebtTransaction

User = get_user_model()


class DebtTransactionAPITestCase(APITestCase):
    """Test case for Debt Transaction API endpoints"""
    
    def setUp(self):
        """Set up test data"""
        # Create test users
        self.user1 = User.objects.create_user(
            username='testuser1',
            email='test1@example.com',
            password='testpass123'
        )
        self.user2 = User.objects.create_user(
            username='testuser2', 
            email='test2@example.com',
            password='testpass123'
        )
        
        # Set up authentication
        self.client = APIClient()
        refresh = RefreshToken.for_user(self.user1)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        # Create test debt transactions for user1
        self.debt1 = DebtTransaction.objects.create(
            user=self.user1,
            person_name='John Doe',
            amount=Decimal('100.00'),
            transaction_type='NEED_TO_GIVE',
            date_created=date.today(),
            due_date=date.today() + timedelta(days=30),
            description='Borrowed money for lunch',
            contact_info='john@example.com'
        )
        
        self.debt2 = DebtTransaction.objects.create(
            user=self.user1,
            person_name='Jane Smith',
            amount=Decimal('250.00'),
            transaction_type='NEED_TO_GET',
            date_created=date.today(),
            due_date=date.today() + timedelta(days=15),
            description='Lent money for books',
            status='PAID'
        )
        
        # Overdue debt
        self.debt3 = DebtTransaction.objects.create(
            user=self.user1,
            person_name='Bob Wilson',
            amount=Decimal('75.50'),
            transaction_type='NEED_TO_GIVE',
            date_created=date.today() - timedelta(days=10),
            due_date=date.today() - timedelta(days=5),  # Overdue
            description='Old debt'
        )
        
        # Create debt for user2 (should not be visible to user1)
        self.debt_user2 = DebtTransaction.objects.create(
            user=self.user2,
            person_name='Alice Brown',
            amount=Decimal('150.00'),
            transaction_type='NEED_TO_GIVE',
            date_created=date.today(),
            due_date=date.today() + timedelta(days=20)
        )
        
        self.list_url = reverse('debts:debt-transactions-list')
        
    def get_detail_url(self, debt_id):
        """Helper to get detail URL"""
        return reverse('debts:debt-transactions-detail', kwargs={'pk': debt_id})
    
    def get_action_url(self, debt_id, action):
        """Helper to get action URL"""
        return reverse(f'debts:debt-transactions-{action}', kwargs={'pk': debt_id})


class DebtTransactionCRUDTestCase(DebtTransactionAPITestCase):
    """Test CRUD operations"""
    
    def test_list_debts(self):
        """Test GET /api/debts/ - List all debt transactions"""
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertIn('summary', response.data)
        
        # Should only return user1's debts (3 debts)
        self.assertEqual(len(response.data['results']), 3)
        self.assertEqual(response.data['summary']['total_count'], 3)
        
        # Check that user2's debt is not included
        person_names = [debt['person_name'] for debt in response.data['results']]
        self.assertNotIn('Alice Brown', person_names)
        
    def test_create_debt(self):
        """Test POST /api/debts/ - Create new debt transaction"""
        data = {
            'person_name': 'New Person',
            'amount': '200.00',
            'transaction_type': 'NEED_TO_GIVE',
            'date_created': date.today().isoformat(),
            'due_date': (date.today() + timedelta(days=30)).isoformat(),
            'description': 'New debt description',
            'contact_info': 'new@example.com'
        }
        
        response = self.client.post(self.list_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(DebtTransaction.objects.filter(user=self.user1).count(), 4)
        
        # Verify the created debt
        created_debt = DebtTransaction.objects.get(person_name='New Person')
        self.assertEqual(created_debt.user, self.user1)
        self.assertEqual(created_debt.amount, Decimal('200.00'))
        
    def test_create_debt_validation_errors(self):
        """Test validation errors when creating debt"""
        # Test negative amount
        data = {
            'person_name': 'Test Person',
            'amount': '-50.00',
            'transaction_type': 'NEED_TO_GIVE',
            'date_created': date.today().isoformat(),
            'due_date': (date.today() + timedelta(days=30)).isoformat(),
        }
        
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('amount', response.data)
        
        # Test past due date
        data['amount'] = '50.00'
        data['due_date'] = (date.today() - timedelta(days=1)).isoformat()
        
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('due_date', response.data)
        
    def test_retrieve_debt(self):
        """Test GET /api/debts/{id}/ - Retrieve specific debt"""
        response = self.client.get(self.get_detail_url(self.debt1.id))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['person_name'], 'John Doe')
        self.assertEqual(float(response.data['amount']), 100.00)
        
    def test_retrieve_debt_not_owned(self):
        """Test retrieving debt not owned by user"""
        response = self.client.get(self.get_detail_url(self.debt_user2.id))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
    def test_update_debt(self):
        """Test PUT /api/debts/{id}/ - Update debt transaction"""
        data = {
            'person_name': 'John Doe Updated',
            'amount': '150.00',
            'due_date': (date.today() + timedelta(days=45)).isoformat(),
            'status': 'UNPAID',
            'description': 'Updated description'
        }
        
        response = self.client.put(self.get_detail_url(self.debt1.id), data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify the update
        self.debt1.refresh_from_db()
        self.assertEqual(self.debt1.person_name, 'John Doe Updated')
        self.assertEqual(self.debt1.amount, Decimal('150.00'))
        
    def test_partial_update_debt(self):
        """Test PATCH /api/debts/{id}/ - Partial update debt"""
        data = {'person_name': 'John Doe Partial Update'}
        
        response = self.client.patch(self.get_detail_url(self.debt1.id), data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify the partial update
        self.debt1.refresh_from_db()
        self.assertEqual(self.debt1.person_name, 'John Doe Partial Update')
        self.assertEqual(self.debt1.amount, Decimal('100.00'))  # Should remain unchanged
        
    def test_delete_debt(self):
        """Test DELETE /api/debts/{id}/ - Delete debt transaction"""
        debt_id = self.debt1.id
        response = self.client.delete(self.get_detail_url(debt_id))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('deleted successfully', response.data['detail'])
        
        # Verify deletion
        self.assertFalse(DebtTransaction.objects.filter(id=debt_id).exists())


class DebtTransactionCustomActionsTestCase(DebtTransactionAPITestCase):
    """Test custom actions"""
    
    def test_mark_paid_action(self):
        """Test POST /api/debts/{id}/mark_paid/ - Mark debt as paid"""
        url = self.get_action_url(self.debt1.id, 'mark-paid')
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('marked as paid successfully', response.data['detail'])
        
        # Verify the debt is marked as paid
        self.debt1.refresh_from_db()
        self.assertEqual(self.debt1.status, 'PAID')
        self.assertIsNotNone(self.debt1.paid_date)
        
    def test_mark_paid_already_paid(self):
        """Test marking already paid debt as paid"""
        url = self.get_action_url(self.debt2.id, 'mark-paid')  # debt2 is already paid
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('already marked as paid', response.data['detail'])
        
    def test_statistics_action(self):
        """Test GET /api/debts/statistics/ - Get debt statistics"""
        url = reverse('debts:debt-transactions-statistics')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check response structure
        self.assertIn('total_statistics', response.data)
        self.assertIn('by_transaction_type', response.data)
        self.assertIn('by_status', response.data)
        self.assertIn('overdue', response.data)
        
        # Check total statistics
        total_stats = response.data['total_statistics']
        self.assertEqual(total_stats['total_count'], 3)
        self.assertEqual(total_stats['total_amount'], 425.50)  # 100 + 250 + 75.5
        
        # Check transaction type breakdown
        by_type = response.data['by_transaction_type']
        self.assertIn('need_to_give', by_type)
        self.assertIn('need_to_get', by_type)
        
        # Check overdue statistics
        overdue_stats = response.data['overdue']
        self.assertEqual(overdue_stats['count'], 1)  # debt3 is overdue
        self.assertEqual(overdue_stats['total_amount'], 75.50)
        
    def test_overdue_action(self):
        """Test GET /api/debts/overdue/ - Get overdue debts"""
        url = reverse('debts:debt-transactions-overdue')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Should return only overdue debt (debt3)
        if 'results' in response.data:  # Paginated response
            results = response.data['results']
        else:  # Non-paginated response
            results = response.data
            
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['person_name'], 'Bob Wilson')


class DebtTransactionFilteringTestCase(DebtTransactionAPITestCase):
    """Test filtering and sorting"""
    
    def test_filter_by_transaction_type(self):
        """Test filtering by transaction type"""
        response = self.client.get(self.list_url, {'transaction_type': 'NEED_TO_GIVE'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        
        # Should return 2 debts (debt1 and debt3)
        self.assertEqual(len(results), 2)
        for debt in results:
            self.assertEqual(debt['transaction_type'], 'NEED_TO_GIVE')
            
    def test_filter_by_status(self):
        """Test filtering by status"""
        response = self.client.get(self.list_url, {'status': 'PAID'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        
        # Should return 1 debt (debt2)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['person_name'], 'Jane Smith')
        
    def test_filter_by_person_name(self):
        """Test filtering by person name (case insensitive)"""
        response = self.client.get(self.list_url, {'person_name': 'john'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        
        # Should return 1 debt (debt1)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['person_name'], 'John Doe')
        
    def test_filter_by_amount_range(self):
        """Test filtering by amount range"""
        response = self.client.get(self.list_url, {
            'amount_min': '100',
            'amount_max': '200'
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        
        # Should return 1 debt (debt1: $100)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['person_name'], 'John Doe')
        
    def test_filter_by_due_date_range(self):
        """Test filtering by due date range"""
        today = date.today()
        future_date = today + timedelta(days=20)
        
        response = self.client.get(self.list_url, {
            'due_date_from': today.isoformat(),
            'due_date_to': future_date.isoformat()
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        
        # Should return debt2 (due in 15 days)
        self.assertGreaterEqual(len(results), 1)
        
    def test_ordering(self):
        """Test ordering by different fields"""
        # Test ordering by amount (ascending)
        response = self.client.get(self.list_url, {'ordering': 'amount'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        
        # First result should have the smallest amount
        amounts = [float(debt['amount']) for debt in results]
        self.assertEqual(amounts, sorted(amounts))
        
        # Test ordering by due_date (descending)
        response = self.client.get(self.list_url, {'ordering': '-due_date'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_search(self):
        """Test search functionality"""
        response = self.client.get(self.list_url, {'search': 'lunch'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        
        # Should find debt1 which has "lunch" in description
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['person_name'], 'John Doe')


class DebtTransactionPaginationTestCase(DebtTransactionAPITestCase):
    """Test pagination"""
    
    def setUp(self):
        super().setUp()
        # Create additional debts to test pagination
        for i in range(25):  # Create 25 additional debts
            DebtTransaction.objects.create(
                user=self.user1,
                person_name=f'Person {i}',
                amount=Decimal('10.00'),
                transaction_type='NEED_TO_GIVE',
                date_created=date.today(),
                due_date=date.today() + timedelta(days=30)
            )
    
    def test_pagination_default(self):
        """Test default pagination (20 items per page)"""
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertIn('next', response.data)
        self.assertIn('previous', response.data)
        self.assertIn('count', response.data)
        
        # Should return 20 items (default page size)
        self.assertEqual(len(response.data['results']), 20)
        self.assertEqual(response.data['count'], 28)  # 3 original + 25 new
        
    def test_pagination_custom_page_size(self):
        """Test custom page size"""
        response = self.client.get(self.list_url, {'page_size': 10})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 10)
        
    def test_pagination_second_page(self):
        """Test accessing second page"""
        response = self.client.get(self.list_url, {'page': 2})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Second page should have remaining items (28 - 20 = 8)
        self.assertEqual(len(response.data['results']), 8)


class DebtTransactionPermissionTestCase(DebtTransactionAPITestCase):
    """Test authentication and permissions"""
    
    def test_unauthenticated_access(self):
        """Test that unauthenticated users cannot access endpoints"""
        # Remove authentication
        self.client.credentials()
        
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_user_isolation(self):
        """Test that users can only access their own debts"""
        # Switch to user2
        refresh = RefreshToken.for_user(self.user2)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Should only see user2's debt
        results = response.data['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['person_name'], 'Alice Brown')


class DebtTransactionModelTestCase(TestCase):
    """Test model methods and properties"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_is_overdue_method(self):
        """Test is_overdue method"""
        # Create overdue debt
        overdue_debt = DebtTransaction.objects.create(
            user=self.user,
            person_name='Test Person',
            amount=Decimal('100.00'),
            transaction_type='NEED_TO_GIVE',
            date_created=date.today() - timedelta(days=10),
            due_date=date.today() - timedelta(days=5)
        )
        
        self.assertTrue(overdue_debt.is_overdue())
        
        # Create future debt
        future_debt = DebtTransaction.objects.create(
            user=self.user,
            person_name='Future Person',
            amount=Decimal('100.00'),
            transaction_type='NEED_TO_GIVE',
            date_created=date.today(),
            due_date=date.today() + timedelta(days=30)
        )
        
        self.assertFalse(future_debt.is_overdue())
        
    def test_days_until_due_property(self):
        """Test days_until_due property"""
        debt = DebtTransaction.objects.create(
            user=self.user,
            person_name='Test Person',
            amount=Decimal('100.00'),
            transaction_type='NEED_TO_GIVE',
            date_created=date.today(),
            due_date=date.today() + timedelta(days=15)
        )
        
        self.assertEqual(debt.days_until_due, 15)
        
    def test_days_overdue_property(self):
        """Test days_overdue property"""
        overdue_debt = DebtTransaction.objects.create(
            user=self.user,
            person_name='Test Person',
            amount=Decimal('100.00'),
            transaction_type='NEED_TO_GIVE',
            date_created=date.today() - timedelta(days=10),
            due_date=date.today() - timedelta(days=5)
        )
        
        self.assertEqual(overdue_debt.days_overdue, 5)
        
    def test_auto_status_update_on_save(self):
        """Test that status is automatically updated to OVERDUE on save"""
        debt = DebtTransaction.objects.create(
            user=self.user,
            person_name='Test Person',
            amount=Decimal('100.00'),
            transaction_type='NEED_TO_GIVE',
            date_created=date.today() - timedelta(days=10),
            due_date=date.today() - timedelta(days=5),
            status='UNPAID'
        )
        
        # Should automatically update to OVERDUE
        debt.refresh_from_db()
        self.assertEqual(debt.status, 'OVERDUE')
        
    def test_paid_date_auto_set(self):
        """Test that paid_date is automatically set when status changes to PAID"""
        debt = DebtTransaction.objects.create(
            user=self.user,
            person_name='Test Person',
            amount=Decimal('100.00'),
            transaction_type='NEED_TO_GIVE',
            date_created=date.today(),
            due_date=date.today() + timedelta(days=30)
        )
        
        # Mark as paid
        debt.status = 'PAID'
        debt.save()
        
        debt.refresh_from_db()
        self.assertIsNotNone(debt.paid_date)
        self.assertEqual(debt.status, 'PAID')
