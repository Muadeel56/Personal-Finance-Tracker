from django.contrib import admin
from .models import Budget, BudgetCategory, BudgetAlert

@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'period_type', 'start_date', 'end_date', 'total_amount', 'is_active')
    list_filter = ('period_type', 'is_active')
    search_fields = ('name', 'user__email', 'notes')

@admin.register(BudgetCategory)
class BudgetCategoryAdmin(admin.ModelAdmin):
    list_display = ('budget', 'category', 'amount')
    list_filter = ('budget__period_type',)
    search_fields = ('budget__name', 'category__name')
    list_select_related = ('budget', 'category')

@admin.register(BudgetAlert)
class BudgetAlertAdmin(admin.ModelAdmin):
    list_display = ('budget_category', 'alert_type', 'threshold', 'is_active')
    list_filter = ('alert_type', 'is_active')
    search_fields = ('budget_category__category__name',)
    list_select_related = ('budget_category', 'budget_category__category')
