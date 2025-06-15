from rest_framework.routers import DefaultRouter
from .views import ReportViewSet, ReportScheduleViewSet, ReportExportViewSet

router = DefaultRouter()
router.register(r'reports', ReportViewSet, basename='reports')
router.register(r'report-schedules', ReportScheduleViewSet, basename='report-schedules')
router.register(r'report-exports', ReportExportViewSet, basename='report-exports')

urlpatterns = router.urls 