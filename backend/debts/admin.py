from django.contrib import admin
from django.utils.html import format_html
from .models import DebtTransaction


@admin.register(DebtTransaction)
class DebtTransactionAdmin(admin.ModelAdmin):
    list_display = [
        'person_name', 
        'amount', 
        'transaction_type', 
        'status_with_overdue',
        'due_date', 
        'days_status',
        'user',
        'created_at'
    ]
    list_filter = [
        'transaction_type', 
        'status', 
        'due_date',
        'created_at',
        'user'
    ]
    search_fields = [
        'person_name', 
        'description', 
        'contact_info',
        'user__username'
    ]
    readonly_fields = [
        'created_at', 
        'updated_at', 
        'paid_date',
        'days_until_due',
        'days_overdue'
    ]
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'person_name', 'amount', 'transaction_type')
        }),
        ('Dates', {
            'fields': ('date_created', 'due_date', 'status', 'paid_date')
        }),
        ('Additional Information', {
            'fields': ('description', 'contact_info'),
            'classes': ('collapse',)
        }),
        ('System Information', {
            'fields': ('created_at', 'updated_at', 'days_until_due', 'days_overdue'),
            'classes': ('collapse',)
        }),
    )
    date_hierarchy = 'due_date'
    ordering = ['-created_at']
    
    def status_with_overdue(self, obj):
        """Display status with automatic overdue detection and color coding"""
        status = obj.get_status_display_with_overdue_check()
        if obj.is_overdue():
            return format_html(
                '<span style="color: red; font-weight: bold;">{}</span>',
                status
            )
        elif obj.status == 'PAID':
            return format_html(
                '<span style="color: green; font-weight: bold;">{}</span>',
                status
            )
        else:
            return format_html(
                '<span style="color: orange;">{}</span>',
                status
            )
    status_with_overdue.short_description = 'Status'
    status_with_overdue.admin_order_field = 'status'
    
    def days_status(self, obj):
        """Show days until due or days overdue"""
        if obj.status == 'PAID':
            return format_html('<span style="color: green;">Paid</span>')
        elif obj.is_overdue():
            days = obj.days_overdue
            return format_html(
                '<span style="color: red;">{} days overdue</span>',
                days
            )
        else:
            days = obj.days_until_due
            if days == 0:
                return format_html('<span style="color: orange;">Due today</span>')
            elif days == 1:
                return format_html('<span style="color: orange;">Due tomorrow</span>')
            elif days <= 7:
                return format_html(
                    '<span style="color: orange;">Due in {} days</span>',
                    days
                )
            else:
                return format_html('Due in {} days', days)
    days_status.short_description = 'Days Status'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        return super().get_queryset(request).select_related('user')
    
    def save_model(self, request, obj, form, change):
        """Auto-assign current user if not set"""
        if not change and not obj.user:
            obj.user = request.user
        super().save_model(request, obj, form, change)
