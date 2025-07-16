from rest_framework import serializers
from .models import Account, Category, Transaction

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'user')

class CategorySerializer(serializers.ModelSerializer):
    transactions_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'user', 'transactions_count')

    def get_transactions_count(self, obj):
        return obj.transactions.count()

class TransactionSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=True
    )
    
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'user')
        extra_kwargs = {
            'category': {'read_only': True},
        } 