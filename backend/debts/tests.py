from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils import timezone
from decimal import Decimal
from datetime import date, timedelta
from .models import DebtTransaction

User = get_user_model()


class DebtTransactionModelTest(TestCase):
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.today = timezone.now().date()
        self.tomorrow = self.today + timedelta(days=1)
        self.yesterday = self.today - timedelta(days=1)
        self.next_week = self.today + timedelta(days=7)
        
        self.valid_debt_data = {
            'user': self.user,
            'person_name': 'John Doe',
            'amount': Decimal('100.00'),
            'transaction_type': 'NEED_TO_GIVE',
            'date_created': self.today,
            'due_date': self.tomorrow,
            'description': 'Test debt',
            'contact_info': 'john@example.com'
        }
    
    def test_create_valid_debt_transaction(self):
        """Test creating a valid debt transaction"""
        debt = DebtTransaction.objects.create(**self.valid_debt_data)
        
        self.assertEqual(debt.user, self.user)
        self.assertEqual(debt.person_name, 'John Doe')
        self.assertEqual(debt.amount, Decimal('100.00'))
        self.assertEqual(debt.transaction_type, 'NEED_TO_GIVE')
        self.assertEqual(debt.status, 'UNPAID')  # Default status
        self.assertIsNotNone(debt.created_at)
        self.assertIsNotNone(debt.updated_at)
        self.assertIsNone(debt.paid_date)
    
    def test_str_method(self):
        """Test string representation of debt transaction"""
        debt = DebtTransaction.objects.create(**self.valid_debt_data)
        expected_str = "John Doe - $100.00"
        self.assertEqual(str(debt), expected_str)
    
    def test_amount_must_be_positive(self):
        """Test that amount must be positive"""
        invalid_data = self.valid_debt_data.copy()
        invalid_data['amount'] = Decimal('-50.00')
        
        debt = DebtTransaction(**invalid_data)
        with self.assertRaises(ValidationError) as context:
            debt.clean()
        
        self.assertIn('amount', context.exception.message_dict)
        self.assertEqual(context.exception.message_dict['amount'], ['Amount must be positive.'])
    
    def test_amount_zero_invalid(self):
        """Test that zero amount is invalid"""
        invalid_data = self.valid_debt_data.copy()
        invalid_data['amount'] = Decimal('0.00')
        
        debt = DebtTransaction(**invalid_data)
        with self.assertRaises(ValidationError):
            debt.clean()
    
    def test_due_date_in_past_on_creation(self):
        """Test that due date cannot be in the past on creation"""
        invalid_data = self.valid_debt_data.copy()
        invalid_data['due_date'] = self.yesterday
        
        debt = DebtTransaction(**invalid_data)
        with self.assertRaises(ValidationError) as context:
            debt.clean()
        
        self.assertIn('due_date', context.exception.message_dict)
        self.assertEqual(context.exception.message_dict['due_date'], ['Due date cannot be in the past.'])
    
    def test_due_date_in_past_allowed_on_update(self):
        """Test that due date in past is allowed on existing records"""
        debt = DebtTransaction.objects.create(**self.valid_debt_data)
        
        # Update existing record with past due date should not raise error
        debt.due_date = self.yesterday
        try:
            debt.clean()  # Should not raise ValidationError
        except ValidationError:
            self.fail("ValidationError raised for existing record with past due date")
    
    def test_is_overdue_method(self):
        """Test is_overdue method"""
        # Create debt with past due date
        overdue_data = self.valid_debt_data.copy()
        overdue_data['due_date'] = self.yesterday
        debt = DebtTransaction(**overdue_data)
        debt.save()
        
        self.assertTrue(debt.is_overdue())
        
        # Mark as paid - should not be overdue
        debt.status = 'PAID'
        debt.save()
        self.assertFalse(debt.is_overdue())
        
        # Future due date - not overdue
        debt.status = 'UNPAID'
        debt.due_date = self.tomorrow
        debt.save()
        self.assertFalse(debt.is_overdue())
    
    def test_auto_status_update_to_overdue(self):
        """Test automatic status update to overdue"""
        overdue_data = self.valid_debt_data.copy()
        overdue_data['due_date'] = self.yesterday
        debt = DebtTransaction(**overdue_data)
        debt.save()
        
        # Should automatically set status to OVERDUE
        self.assertEqual(debt.status, 'OVERDUE')
    
    def test_paid_date_auto_set(self):
        """Test that paid_date is automatically set when status changes to PAID"""
        debt = DebtTransaction.objects.create(**self.valid_debt_data)
        self.assertIsNone(debt.paid_date)
        
        # Mark as paid
        debt.status = 'PAID'
        debt.save()
        
        self.assertIsNotNone(debt.paid_date)
        self.assertAlmostEqual(
            debt.paid_date.timestamp(),
            timezone.now().timestamp(),
            delta=10  # Within 10 seconds
        )
    
    def test_paid_date_cleared_when_status_changes_from_paid(self):
        """Test that paid_date is cleared when status changes from PAID"""
        debt = DebtTransaction.objects.create(**self.valid_debt_data)
        
        # Mark as paid
        debt.status = 'PAID'
        debt.save()
        self.assertIsNotNone(debt.paid_date)
        
        # Change status back to unpaid
        debt.status = 'UNPAID'
        debt.save()
        self.assertIsNone(debt.paid_date)
    
    def test_days_until_due_property(self):
        """Test days_until_due property"""
        # Future due date
        future_data = self.valid_debt_data.copy()
        future_data['due_date'] = self.next_week
        debt = DebtTransaction.objects.create(**future_data)
        
        self.assertEqual(debt.days_until_due, 7)
        
        # Paid debt should return None
        debt.status = 'PAID'
        debt.save()
        self.assertIsNone(debt.days_until_due)
    
    def test_days_overdue_property(self):
        """Test days_overdue property"""
        # Past due date
        overdue_data = self.valid_debt_data.copy()
        overdue_data['due_date'] = self.yesterday
        debt = DebtTransaction(**overdue_data)
        debt.save()
        
        self.assertEqual(debt.days_overdue, 1)
        
        # Not overdue debt should return 0
        debt.due_date = self.tomorrow
        debt.status = 'UNPAID'
        debt.save()
        self.assertEqual(debt.days_overdue, 0)
        
        # Paid debt should return 0
        debt.status = 'PAID'
        debt.save()
        self.assertEqual(debt.days_overdue, 0)
    
    def test_get_status_display_with_overdue_check(self):
        """Test get_status_display_with_overdue_check method"""
        # Overdue debt
        overdue_data = self.valid_debt_data.copy()
        overdue_data['due_date'] = self.yesterday
        debt = DebtTransaction(**overdue_data)
        debt.save()
        
        self.assertEqual(debt.get_status_display_with_overdue_check(), 'Overdue')
        
        # Paid debt
        debt.status = 'PAID'
        debt.save()
        self.assertEqual(debt.get_status_display_with_overdue_check(), 'Paid')
        
        # Regular unpaid debt
        debt.status = 'UNPAID'
        debt.due_date = self.tomorrow
        debt.save()
        self.assertEqual(debt.get_status_display_with_overdue_check(), 'Unpaid')
    
    def test_transaction_type_choices(self):
        """Test transaction type choices"""
        # NEED_TO_GIVE
        debt1 = DebtTransaction.objects.create(**self.valid_debt_data)
        self.assertEqual(debt1.transaction_type, 'NEED_TO_GIVE')
        
        # NEED_TO_GET
        data2 = self.valid_debt_data.copy()
        data2['transaction_type'] = 'NEED_TO_GET'
        data2['person_name'] = 'Jane Doe'
        debt2 = DebtTransaction.objects.create(**data2)
        self.assertEqual(debt2.transaction_type, 'NEED_TO_GET')
    
    def test_status_choices(self):
        """Test status choices"""
        debt = DebtTransaction.objects.create(**self.valid_debt_data)
        
        # Test all valid status choices
        valid_statuses = ['UNPAID', 'PAID', 'OVERDUE']
        for status in valid_statuses:
            debt.status = status
            debt.save()
            self.assertEqual(debt.status, status)
    
    def test_optional_fields(self):
        """Test optional fields can be None/blank"""
        minimal_data = {
            'user': self.user,
            'person_name': 'Minimal Person',
            'amount': Decimal('50.00'),
            'transaction_type': 'NEED_TO_GIVE',
            'date_created': self.today,
            'due_date': self.tomorrow,
        }
        
        debt = DebtTransaction.objects.create(**minimal_data)
        self.assertIsNone(debt.description)
        self.assertIsNone(debt.contact_info)
        self.assertIsNone(debt.paid_date)
    
    def test_model_ordering(self):
        """Test model default ordering by created_at descending"""
        # Create multiple debts with different creation times
        debt1 = DebtTransaction.objects.create(**self.valid_debt_data)
        
        data2 = self.valid_debt_data.copy()
        data2['person_name'] = 'Jane Doe'
        debt2 = DebtTransaction.objects.create(**data2)
        
        debts = DebtTransaction.objects.all()
        self.assertEqual(debts.first(), debt2)  # Most recent first
        self.assertEqual(debts.last(), debt1)
    
    def test_verbose_names(self):
        """Test model verbose names"""
        self.assertEqual(DebtTransaction._meta.verbose_name, 'Debt Transaction')
        self.assertEqual(DebtTransaction._meta.verbose_name_plural, 'Debt Transactions')
    
    def test_related_name(self):
        """Test related name for user foreign key"""
        debt = DebtTransaction.objects.create(**self.valid_debt_data)
        user_debts = self.user.debt_transactions.all()
        self.assertIn(debt, user_debts)
