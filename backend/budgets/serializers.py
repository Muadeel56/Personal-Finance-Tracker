from rest_framework import serializers
from .models import Budget, BudgetCategory, BudgetAlert

class BudgetCategorySerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = BudgetCategory
        fields = ['id', 'category', 'category_name', 'amount', 'notes', 'created_at', 'updated_at']
        read_only_fields = ('id', 'created_at', 'updated_at', 'category_name')

class BudgetCategoryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetCategory
        fields = ['category', 'amount', 'notes']

class BudgetAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetAlert
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class BudgetSerializer(serializers.ModelSerializer):
    categories = BudgetCategorySerializer(many=True, read_only=True)
    category_allocations = BudgetCategoryCreateSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = Budget
        fields = ['id', 'name', 'period_type', 'start_date', 'end_date', 'total_amount', 
                 'notes', 'is_active', 'created_at', 'updated_at', 'categories', 'category_allocations']
        read_only_fields = ('id', 'created_at', 'updated_at', 'user', 'categories')

    def create(self, validated_data):
        category_allocations = validated_data.pop('category_allocations', [])
        budget = Budget.objects.create(**validated_data)
        
        # Create budget categories if provided
        for allocation in category_allocations:
            BudgetCategory.objects.create(budget=budget, **allocation)
        
        return budget

    def update(self, instance, validated_data):
        category_allocations = validated_data.pop('category_allocations', None)
        
        # Update budget fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update category allocations if provided
        if category_allocations is not None:
            # Delete existing allocations
            instance.categories.all().delete()
            
            # Create new allocations
            for allocation in category_allocations:
                BudgetCategory.objects.create(budget=instance, **allocation)
        
        return instance 