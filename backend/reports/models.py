from django.db import models
from django.utils.translation import gettext_lazy as _
from accounts.models import User

class Report(models.Model):
    """
    Saved financial reports and their configurations
    """
    REPORT_TYPES = [
        ('INCOME_EXPENSE', 'Income vs Expense'),
        ('CATEGORY_BREAKDOWN', 'Category Breakdown'),
        ('CASH_FLOW', 'Cash Flow'),
        ('BUDGET_VS_ACTUAL', 'Budget vs Actual'),
        ('CUSTOM', 'Custom Report'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    name = models.CharField(max_length=100)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    date_range_start = models.DateField()
    date_range_end = models.DateField()
    filters = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_favorite = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    last_generated = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.report_type})"

class ReportSchedule(models.Model):
    """
    Scheduled report generation
    """
    FREQUENCY_CHOICES = [
        ('DAILY', 'Daily'),
        ('WEEKLY', 'Weekly'),
        ('MONTHLY', 'Monthly'),
        ('QUARTERLY', 'Quarterly'),
        ('YEARLY', 'Yearly'),
    ]

    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='schedules')
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    next_run = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    email_recipients = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Schedule for {self.report.name} ({self.frequency})"

class ReportExport(models.Model):
    """
    Exported report files
    """
    FORMAT_CHOICES = [
        ('PDF', 'PDF'),
        ('EXCEL', 'Excel'),
        ('CSV', 'CSV'),
    ]

    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='exports')
    format = models.CharField(max_length=10, choices=FORMAT_CHOICES)
    file = models.FileField(upload_to='report_exports/')
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.report.name} ({self.format}) - {self.created_at}"
