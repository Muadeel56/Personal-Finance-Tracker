from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils import timezone
from decimal import Decimal

User = get_user_model()


class DebtTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('NEED_TO_GIVE', 'Need to Give'),
        ('NEED_TO_GET', 'Need to Get'),
    ]
    
    STATUS_CHOICES = [
        ('UNPAID', 'Unpaid'),
        ('PAID', 'Paid'),
        ('OVERDUE', 'Overdue'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='debt_transactions')
    person_name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=15, choices=TRANSACTION_TYPES)
    date_created = models.DateField(help_text="When debt was incurred")
    due_date = models.DateField(help_text="Expected payment/return date")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='UNPAID')
    description = models.TextField(blank=True, null=True)
    contact_info = models.CharField(max_length=200, blank=True, null=True, 
                                   help_text="Phone number or email")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_date = models.DateTimeField(blank=True, null=True, 
                                    help_text="When marked as paid")
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Debt Transaction'
        verbose_name_plural = 'Debt Transactions'
    
    def __str__(self):
        return f"{self.person_name} - ${self.amount}"
    
    def clean(self):
        """Model validation"""
        errors = {}
        
        # Amount must be positive
        if self.amount is not None and self.amount <= 0:
            errors['amount'] = 'Amount must be positive.'
        
        # Due date cannot be in the past on creation
        if self.due_date and self.due_date < timezone.now().date():
            if not self.pk:  # Only check on creation, not updates
                errors['due_date'] = 'Due date cannot be in the past.'
        
        if errors:
            raise ValidationError(errors)
    
    def save(self, *args, **kwargs):
        # Run validation before saving
        self.clean()
        
        # Auto-update status to overdue if applicable
        if self.status == 'UNPAID' and self.is_overdue():
            self.status = 'OVERDUE'
        
        # Set paid_date when status changes to PAID
        if self.status == 'PAID' and not self.paid_date:
            self.paid_date = timezone.now()
        # Clear paid_date if status changes from PAID to something else
        elif self.status != 'PAID' and self.paid_date:
            self.paid_date = None
            
        super().save(*args, **kwargs)
    
    def is_overdue(self):
        """Check if debt is overdue"""
        return (self.due_date < timezone.now().date() and 
                self.status != 'PAID')
    
    def get_status_display_with_overdue_check(self):
        """Get display status with automatic overdue detection"""
        if self.is_overdue() and self.status == 'UNPAID':
            return 'Overdue'
        return self.get_status_display()
    
    @property
    def days_until_due(self):
        """Calculate days until due date"""
        if self.status == 'PAID':
            return None
        delta = self.due_date - timezone.now().date()
        return delta.days
    
    @property
    def days_overdue(self):
        """Calculate days overdue (positive number if overdue)"""
        if self.status == 'PAID' or not self.is_overdue():
            return 0
        delta = timezone.now().date() - self.due_date
        return delta.days
