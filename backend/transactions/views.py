from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Account, Category, Transaction
from .serializers import AccountSerializer, CategorySerializer, TransactionSerializer

# Create your views here.

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Get dashboard statistics for the authenticated user"""
        # Get date range from query params
        time_range = request.query_params.get('time_range', 'current_month')
        
        # Calculate date range
        now = timezone.now()
        if time_range == 'current_month':
            start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            end_date = (start_date + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        elif time_range == 'previous_month':
            start_date = (now.replace(day=1) - timedelta(days=1)).replace(day=1)
            end_date = now.replace(day=1) - timedelta(days=1)
        elif time_range == 'current_year':
            start_date = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
            end_date = now.replace(month=12, day=31, hour=23, minute=59, second=59, microsecond=999999)
        else:
            # Default to current month
            start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            end_date = (start_date + timedelta(days=32)).replace(day=1) - timedelta(days=1)

        # Get transactions in date range
        transactions = Transaction.objects.filter(
            user=request.user,
            date__gte=start_date,
            date__lte=end_date
        )

        # Calculate statistics
        income_transactions = transactions.filter(transaction_type='INCOME')
        expense_transactions = transactions.filter(transaction_type='EXPENSE')

        total_income = income_transactions.aggregate(total=Sum('amount'))['total'] or 0
        total_expenses = abs(expense_transactions.aggregate(total=Sum('amount'))['total'] or 0)
        net_balance = total_income - total_expenses
        savings_rate = (float(net_balance) / float(total_income) * 100) if total_income > 0 else 0

        # Category breakdown for expenses
        category_breakdown = expense_transactions.values('category__name').annotate(
            total=Sum('amount')
        ).order_by('-total')[:10]

        # Recent transactions
        recent_transactions = transactions.order_by('-date')[:5]

        # Monthly trend data (last 6 months)
        trend_data = []
        for i in range(6):
            month_start = (now - timedelta(days=30*i)).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            
            month_transactions = Transaction.objects.filter(
                user=request.user,
                date__gte=month_start,
                date__lte=month_end
            )
            
            month_income = month_transactions.filter(transaction_type='INCOME').aggregate(
                total=Sum('amount'))['total'] or 0
            month_expenses = abs(month_transactions.filter(transaction_type='EXPENSE').aggregate(
                total=Sum('amount'))['total'] or 0)
            
            trend_data.append({
                'month': month_start.strftime('%Y-%m'),
                'income': float(month_income),
                'expenses': float(month_expenses),
                'balance': float(month_income - month_expenses)
            })

        return Response({
            'time_range': time_range,
            'date_range': {
                'start': start_date.strftime('%Y-%m-%d'),
                'end': end_date.strftime('%Y-%m-%d')
            },
            'statistics': {
                'total_income': float(total_income),
                'total_expenses': float(total_expenses),
                'net_balance': float(net_balance),
                'savings_rate': round(savings_rate, 1),
                'transaction_count': transactions.count()
            },
            'category_breakdown': [
                {
                    'category': item['category__name'] or 'Uncategorized',
                    'amount': abs(float(item['total']))
                }
                for item in category_breakdown
            ],
            'recent_transactions': TransactionSerializer(recent_transactions, many=True).data,
            'trend_data': trend_data
        })

    @action(detail=False, methods=['get'])
    def category_stats(self, request):
        """Get category-wise statistics"""
        time_range = request.query_params.get('time_range', 'current_month')
        
        # Calculate date range
        now = timezone.now()
        if time_range == 'current_month':
            start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            end_date = (start_date + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        else:
            start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            end_date = (start_date + timedelta(days=32)).replace(day=1) - timedelta(days=1)

        transactions = Transaction.objects.filter(
            user=request.user,
            date__gte=start_date,
            date__lte=end_date
        )

        # Get category statistics
        category_stats = transactions.values('category__name', 'transaction_type').annotate(
            total=Sum('amount'),
            count=Count('id')
        ).order_by('category__name', 'transaction_type')

        # Group by category
        categories = {}
        for stat in category_stats:
            category_name = stat['category__name'] or 'Uncategorized'
            if category_name not in categories:
                categories[category_name] = {
                    'name': category_name,
                    'income': 0,
                    'expenses': 0,
                    'transaction_count': 0
                }
            
            if stat['transaction_type'] == 'INCOME':
                categories[category_name]['income'] = float(stat['total'])
            else:
                categories[category_name]['expenses'] = abs(float(stat['total']))
            
            categories[category_name]['transaction_count'] += stat['count']

        return Response({
            'categories': list(categories.values()),
            'time_range': time_range
        })
