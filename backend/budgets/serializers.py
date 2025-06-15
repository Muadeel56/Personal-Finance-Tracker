from rest_framework import serializers
from .models import Budget, BudgetCategory, BudgetAlert

class BudgetCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetCategory
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class BudgetAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetAlert
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class BudgetSerializer(serializers.ModelSerializer):
    categories = BudgetCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Budget
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'user', 'categories') 