from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Report, ReportSchedule, ReportExport
from .serializers import ReportSerializer, ReportScheduleSerializer, ReportExportSerializer

# Create your views here.

class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Report.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ReportScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = ReportScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Optionally filter by report via query param
        report_id = self.request.query_params.get('report')
        qs = ReportSchedule.objects.all()
        if report_id:
            qs = qs.filter(report__id=report_id, report__user=self.request.user)
        else:
            qs = qs.filter(report__user=self.request.user)
        return qs

class ReportExportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportExportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Optionally filter by report via query param
        report_id = self.request.query_params.get('report')
        qs = ReportExport.objects.all()
        if report_id:
            qs = qs.filter(report__id=report_id, report__user=self.request.user)
        else:
            qs = qs.filter(report__user=self.request.user)
        return qs
