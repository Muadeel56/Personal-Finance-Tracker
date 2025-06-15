from django.db import models
from django.utils.translation import gettext_lazy as _
from accounts.models import User
from transactions.models import Category

class Budget(models.Model):
    """
    Budget periods and their settings
    """
    PERIOD_TYPES = [
        ('MONTHLY', 'Monthly'),
        ('QUARTERLY', 'Quarterly'),
        ('YEARLY', 'Yearly'),
        ('CUSTOM', 'Custom'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    name = models.CharField(max_length=100)
    period_type = models.CharField(max_length=20, choices=PERIOD_TYPES)
    start_date = models.DateField()
    end_date = models.DateField()
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.period_type})"

class BudgetCategory(models.Model):
    """
    Budget allocations for specific categories
    """
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='categories')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='budget_allocations')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = 'Budget Categories'
        unique_together = ['budget', 'category']

    def __str__(self):
        return f"{self.category.name} - {self.amount}"

class BudgetAlert(models.Model):
    """
    Alerts for budget thresholds
    """
    ALERT_TYPES = [
        ('PERCENTAGE', 'Percentage of Budget'),
        ('AMOUNT', 'Fixed Amount'),
    ]

    budget_category = models.ForeignKey(BudgetCategory, on_delete=models.CASCADE, related_name='alerts')
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    threshold = models.DecimalField(max_digits=12, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Alert for {self.budget_category.category.name} at {self.threshold}"
