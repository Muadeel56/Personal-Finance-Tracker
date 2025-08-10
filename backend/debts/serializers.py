from rest_framework import serializers
from .models import DebtTransaction


class DebtTransactionSerializer(serializers.ModelSerializer):
    """Serializer for DebtTransaction model"""
    
    days_until_due = serializers.ReadOnlyField()
    days_overdue = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()
    status_display = serializers.CharField(source='get_status_display_with_overdue_check', read_only=True)
    
    class Meta:
        model = DebtTransaction
        fields = [
            'id',
            'user',
            'person_name',
            'amount',
            'transaction_type',
            'date_created',
            'due_date',
            'status',
            'status_display',
            'description',
            'contact_info',
            'created_at',
            'updated_at',
            'paid_date',
            'days_until_due',
            'days_overdue',
            'is_overdue',
        ]
        read_only_fields = ['user', 'created_at', 'updated_at', 'paid_date']
    
    def validate_amount(self, value):
        """Validate that amount is positive"""
        if value <= 0:
            raise serializers.ValidationError("Amount must be positive.")
        return value
    
    def validate(self, data):
        """Additional validation"""
        # Check due date is not in the past for new records
        if not self.instance and 'due_date' in data:
            from django.utils import timezone
            if data['due_date'] < timezone.now().date():
                raise serializers.ValidationError({
                    'due_date': 'Due date cannot be in the past.'
                })
        return data


class DebtTransactionListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    
    status_display = serializers.CharField(source='get_status_display_with_overdue_check', read_only=True)
    days_until_due = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()
    
    class Meta:
        model = DebtTransaction
        fields = [
            'id',
            'person_name',
            'amount',
            'transaction_type',
            'due_date',
            'status',
            'status_display',
            'days_until_due',
            'is_overdue',
            'created_at',
        ]


class DebtTransactionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating debt transactions"""
    
    class Meta:
        model = DebtTransaction
        fields = [
            'person_name',
            'amount',
            'transaction_type',
            'date_created',
            'due_date',
            'description',
            'contact_info',
        ]
    
    def validate_amount(self, value):
        """Validate that amount is positive"""
        if value <= 0:
            raise serializers.ValidationError("Amount must be positive.")
        return value
    
    def validate_due_date(self, value):
        """Validate due date is not in the past"""
        from django.utils import timezone
        if value < timezone.now().date():
            raise serializers.ValidationError("Due date cannot be in the past.")
        return value


class DebtTransactionUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating debt transactions"""
    
    class Meta:
        model = DebtTransaction
        fields = [
            'person_name',
            'amount',
            'due_date',
            'status',
            'description',
            'contact_info',
        ]
    
    def validate_amount(self, value):
        """Validate that amount is positive"""
        if value <= 0:
            raise serializers.ValidationError("Amount must be positive.")
        return value 