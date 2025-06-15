from django.contrib import admin
from .models import Account, Category, Transaction

@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'account_type', 'balance', 'currency', 'is_active')
    list_filter = ('account_type', 'currency', 'is_active')
    search_fields = ('name', 'user__email', 'institution')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'is_income', 'parent')
    list_filter = ('is_income',)
    search_fields = ('name', 'user__email')
    list_select_related = ('parent',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('description', 'user', 'amount', 'category', 'transaction_type', 'date')
    list_filter = ('transaction_type', 'date', 'is_recurring')
    search_fields = ('description', 'user__email', 'notes')
    list_select_related = ('category',)
