from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, Avg, Q
from django.utils import timezone
from datetime import datetime, timedelta
from transactions.models import Transaction
from budgets.models import Budget
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

    @action(detail=False, methods=['get'])
    def financial_summary(self, request):
        """Generate financial summary report"""
        # Get date range from query params
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not start_date or not end_date:
            # Default to current month
            now = timezone.now()
            start_date = now.replace(day=1).strftime('%Y-%m-%d')
            end_date = (now.replace(day=1) + timedelta(days=32)).replace(day=1).strftime('%Y-%m-%d')

        # Parse dates
        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()

        # Get transactions in date range
        transactions = Transaction.objects.filter(
            user=request.user,
            date__gte=start_date,
            date__lte=end_date
        )

        # Calculate summary statistics
        income_transactions = transactions.filter(transaction_type='INCOME')
        expense_transactions = transactions.filter(transaction_type='EXPENSE')

        total_income = income_transactions.aggregate(total=Sum('amount'))['total'] or 0
        total_expenses = abs(expense_transactions.aggregate(total=Sum('amount'))['total'] or 0)
        net_income = total_income - total_expenses
        savings_rate = (float(net_income) / float(total_income) * 100) if total_income > 0 else 0

        # Category breakdown
        category_breakdown = expense_transactions.values('category__name').annotate(
            total=Sum('amount'),
            count=Count('id')
        ).order_by('-total')

        # Monthly breakdown
        monthly_data = []
        current_date = start_date
        while current_date <= end_date:
            month_start = current_date.replace(day=1)
            month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            
            month_transactions = transactions.filter(
                date__gte=month_start,
                date__lte=month_end
            )
            
            month_income = month_transactions.filter(transaction_type='INCOME').aggregate(
                total=Sum('amount'))['total'] or 0
            month_expenses = abs(month_transactions.filter(transaction_type='EXPENSE').aggregate(
                total=Sum('amount'))['total'] or 0)
            
            monthly_data.append({
                'month': month_start.strftime('%Y-%m'),
                'income': float(month_income),
                'expenses': float(month_expenses),
                'net': float(month_income - month_expenses)
            })
            
            current_date = (month_start + timedelta(days=32)).replace(day=1)

        return Response({
            'period': {
                'start_date': start_date.strftime('%Y-%m-%d'),
                'end_date': end_date.strftime('%Y-%m-%d')
            },
            'summary': {
                'total_income': float(total_income),
                'total_expenses': float(total_expenses),
                'net_income': float(net_income),
                'savings_rate': round(savings_rate, 1),
                'transaction_count': transactions.count()
            },
            'category_breakdown': [
                {
                    'category': item['category__name'] or 'Uncategorized',
                    'amount': abs(float(item['total'])),
                    'count': item['count'],
                    'percentage': round((abs(float(item['total'])) / float(total_expenses) * 100), 1) if total_expenses > 0 else 0
                }
                for item in category_breakdown
            ],
            'monthly_breakdown': monthly_data
        })

    @action(detail=False, methods=['get'])
    def cash_flow(self, request):
        """Generate cash flow report"""
        # Get date range from query params
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not start_date or not end_date:
            # Default to last 12 months
            now = timezone.now()
            end_date = now.strftime('%Y-%m-%d')
            start_date = (now - timedelta(days=365)).strftime('%Y-%m-%d')

        # Parse dates
        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()

        # Get transactions in date range
        transactions = Transaction.objects.filter(
            user=request.user,
            date__gte=start_date,
            date__lte=end_date
        ).order_by('date')

        # Group by month
        cash_flow_data = []
        current_date = start_date.replace(day=1)
        
        while current_date <= end_date:
            month_end = (current_date + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            
            month_transactions = transactions.filter(
                date__gte=current_date,
                date__lte=month_end
            )
            
            income = month_transactions.filter(transaction_type='INCOME').aggregate(
                total=Sum('amount'))['total'] or 0
            expenses = abs(month_transactions.filter(transaction_type='EXPENSE').aggregate(
                total=Sum('amount'))['total'] or 0)
            
            cash_flow_data.append({
                'month': current_date.strftime('%Y-%m'),
                'income': float(income),
                'expenses': float(expenses),
                'net_cash_flow': float(income - expenses),
                'transaction_count': month_transactions.count()
            })
            
            current_date = (current_date + timedelta(days=32)).replace(day=1)

        return Response({
            'period': {
                'start_date': start_date.strftime('%Y-%m-%d'),
                'end_date': end_date.strftime('%Y-%m-%d')
            },
            'cash_flow_data': cash_flow_data
        })

    @action(detail=False, methods=['get'])
    def budget_vs_actual(self, request):
        """Generate budget vs actual report"""
        # Get active budgets
        now = timezone.now()
        active_budgets = Budget.objects.filter(
            user=request.user,
            is_active=True,
            start_date__lte=now.date(),
            end_date__gte=now.date()
        )

        budget_comparison = []
        
        for budget in active_budgets:
            # Get transactions in budget period
            budget_transactions = Transaction.objects.filter(
                user=request.user,
                date__gte=budget.start_date,
                date__lte=budget.end_date
            )
            
            # Calculate actual spending
            actual_spending = abs(budget_transactions.filter(
                transaction_type='EXPENSE'
            ).aggregate(total=Sum('amount'))['total'] or 0)
            
            budget_amount = float(budget.total_amount)
            variance = budget_amount - actual_spending
            variance_percentage = (variance / budget_amount * 100) if budget_amount > 0 else 0
            
            budget_comparison.append({
                'budget_id': budget.id,
                'budget_name': budget.name,
                'period': f"{budget.start_date} - {budget.end_date}",
                'budget_amount': budget_amount,
                'actual_spending': float(actual_spending),
                'variance': float(variance),
                'variance_percentage': round(variance_percentage, 1),
                'utilization_percentage': round((actual_spending / budget_amount * 100), 1) if budget_amount > 0 else 0
            })

        return Response({
            'budget_comparison': budget_comparison,
            'total_budgets': len(budget_comparison)
        })

    @action(detail=False, methods=['get'])
    def spending_trends(self, request):
        """Generate spending trends report"""
        # Get date range from query params
        months = int(request.query_params.get('months', 12))
        
        now = timezone.now()
        end_date = now.date()
        start_date = (now - timedelta(days=30*months)).date()

        # Get transactions in date range
        transactions = Transaction.objects.filter(
            user=request.user,
            date__gte=start_date,
            date__lte=end_date
        )

        # Group by month
        trends_data = []
        current_date = start_date.replace(day=1)
        
        while current_date <= end_date:
            month_end = (current_date + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            
            month_transactions = transactions.filter(
                date__gte=current_date,
                date__lte=month_end
            )
            
            # Calculate spending by category
            category_spending = month_transactions.filter(
                transaction_type='EXPENSE'
            ).values('category__name').annotate(
                total=Sum('amount')
            ).order_by('-total')
            
            trends_data.append({
                'month': current_date.strftime('%Y-%m'),
                'total_spending': abs(float(month_transactions.filter(
                    transaction_type='EXPENSE'
                ).aggregate(total=Sum('amount'))['total'] or 0)),
                'category_breakdown': [
                    {
                        'category': item['category__name'] or 'Uncategorized',
                        'amount': abs(float(item['total']))
                    }
                    for item in category_spending[:5]  # Top 5 categories
                ]
            })
            
            current_date = (current_date + timedelta(days=32)).replace(day=1)

        return Response({
            'period': {
                'start_date': start_date.strftime('%Y-%m-%d'),
                'end_date': end_date.strftime('%Y-%m-%d'),
                'months': months
            },
            'trends_data': trends_data
        })

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
