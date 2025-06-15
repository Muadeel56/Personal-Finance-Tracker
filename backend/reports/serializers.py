from rest_framework import serializers
from .models import Report, ReportSchedule, ReportExport

class ReportExportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportExport
        fields = '__all__'
        read_only_fields = ('id', 'created_at')

class ReportScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportSchedule
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class ReportSerializer(serializers.ModelSerializer):
    schedules = ReportScheduleSerializer(many=True, read_only=True)
    exports = ReportExportSerializer(many=True, read_only=True)

    class Meta:
        model = Report
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'user', 'schedules', 'exports') 