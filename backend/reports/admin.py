from django.contrib import admin
from .models import Report, ReportSchedule, ReportExport

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'report_type', 'date_range_start', 'date_range_end', 'is_favorite')
    list_filter = ('report_type', 'is_favorite')
    search_fields = ('name', 'user__email', 'notes')

@admin.register(ReportSchedule)
class ReportScheduleAdmin(admin.ModelAdmin):
    list_display = ('report', 'frequency', 'next_run', 'is_active')
    list_filter = ('frequency', 'is_active')
    search_fields = ('report__name',)
    list_select_related = ('report',)

@admin.register(ReportExport)
class ReportExportAdmin(admin.ModelAdmin):
    list_display = ('report', 'format', 'created_at', 'expires_at')
    list_filter = ('format',)
    search_fields = ('report__name',)
    list_select_related = ('report',)
