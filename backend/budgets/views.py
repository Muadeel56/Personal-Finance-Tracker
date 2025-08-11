from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Budget, BudgetCategory, BudgetAlert
from .serializers import BudgetSerializer, BudgetCategorySerializer, BudgetAlertSerializer
from transactions.models import Transaction
from transactions.serializers import TransactionSerializer

# Create your views here.

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get'])
    def spending_analysis(self, request, pk=None):
        """Get spending analysis for a specific budget"""
        budget = self.get_object()
        
        print(f"Analyzing budget: {budget.name} (ID: {budget.id})")
        print(f"Budget period: {budget.start_date} to {budget.end_date}")
        
        # Get budget categories first
        budget_categories = budget.categories.all()
        print(f"Budget has {budget_categories.count()} category allocations")
        
        # Get category IDs allocated to this budget (filter out None categories)
        allocated_category_ids = [bc.category.id for bc in budget_categories if bc.category]
        print(f"Allocated category IDs: {allocated_category_ids}")
        
        # Get transactions within budget period AND only for allocated categories
        if allocated_category_ids:
            transactions = Transaction.objects.filter(
                user=request.user,
                transaction_type='EXPENSE',
                date__gte=budget.start_date,
                date__lte=budget.end_date,
                category__id__in=allocated_category_ids  # Only include transactions for allocated categories
            )
        else:
            # If no categories are allocated to this budget, no transactions should be counted
            transactions = Transaction.objects.none()
            print(f"No categories allocated to budget {budget.name}, so no transactions counted")
        
        print(f"Found {transactions.count()} transactions in budget period for allocated categories")
        for t in transactions:
            print(f"  - {t.description}: ${t.amount} ({t.category.name}) on {t.date}")
        
        # Calculate total spending for this budget (only allocated categories)
        total_spent = abs(transactions.aggregate(total=Sum('amount'))['total'] or 0)
        print(f"Total spent for this budget's categories: ${total_spent}")
        
        category_spending = []
        
        for budget_category in budget_categories:
            print(f"Analyzing category: {budget_category.category.name} (budgeted: ${budget_category.amount})")
            category_transactions = transactions.filter(category=budget_category.category)
            print(f"  Found {category_transactions.count()} transactions for this category")
            
            spent_amount = abs(category_transactions.aggregate(total=Sum('amount'))['total'] or 0)
            print(f"  Total spent: ${spent_amount}")
            
            category_spending.append({
                'category_id': budget_category.category.id,
                'category_name': budget_category.category.name,
                'budgeted_amount': float(budget_category.amount),
                'spent_amount': float(spent_amount),
                'remaining_amount': float(budget_category.amount - spent_amount),
                'percentage_used': float((spent_amount / budget_category.amount * 100) if budget_category.amount > 0 else 0),
                'is_over_budget': spent_amount > budget_category.amount
            })
        
        # Calculate overall budget progress (using only allocated category spending)
        budget_progress = {
            'total_budgeted': float(budget.total_amount),
            'total_spent': float(total_spent),
            'total_remaining': float(budget.total_amount - total_spent),
            'percentage_used': float((total_spent / budget.total_amount * 100) if budget.total_amount > 0 else 0),
            'is_over_budget': total_spent > budget.total_amount,
            'days_remaining': (budget.end_date - timezone.now().date()).days,
            'daily_average_spent': float(total_spent / max(1, (timezone.now().date() - budget.start_date).days)) if timezone.now().date() > budget.start_date else 0
        }
        
        print(f"Budget progress: {budget_progress}")
        
        return Response({
            'budget': BudgetSerializer(budget).data,
            'overall_progress': budget_progress,
            'category_breakdown': category_spending,
            'recent_transactions': TransactionSerializer(
                transactions.order_by('-date')[:10], 
                many=True
            ).data if 'TransactionSerializer' in globals() else []
        })

    @action(detail=False, methods=['get'])
    def dashboard_overview(self, request):
        """Get overview of all budgets with spending data"""
        budgets = self.get_queryset().filter(is_active=True)
        budget_overviews = []
        
        for budget in budgets:
            try:
                # Get category IDs allocated to this budget
                budget_categories = budget.categories.all()
                allocated_category_ids = [bc.category.id for bc in budget_categories if bc.category]
                
                # Get transactions for this budget period AND only for allocated categories
                if allocated_category_ids:
                    transactions = Transaction.objects.filter(
                        user=request.user,
                        transaction_type='EXPENSE',
                        date__gte=budget.start_date,
                        date__lte=budget.end_date,
                        category__id__in=allocated_category_ids  # Only include transactions for allocated categories
                    )
                else:
                    # If no categories are allocated to this budget, no transactions should be counted
                    transactions = Transaction.objects.none()
                
                total_spent = abs(transactions.aggregate(total=Sum('amount'))['total'] or 0)
            except Exception as e:
                print(f"Error processing budget {budget.id}: {e}")
                # If there's an error, set default values
                total_spent = 0
            
            budget_overviews.append({
                'id': budget.id,
                'name': budget.name,
                'period_type': budget.period_type,
                'start_date': budget.start_date,
                'end_date': budget.end_date,
                'total_budgeted': float(budget.total_amount),
                'total_spent': float(total_spent),
                'percentage_used': float((total_spent / budget.total_amount * 100) if budget.total_amount > 0 else 0),
                'is_over_budget': total_spent > budget.total_amount,
                'days_remaining': (budget.end_date - timezone.now().date()).days,
                'status': 'over_budget' if total_spent > budget.total_amount else 'on_track' if total_spent < float(budget.total_amount) * 0.9 else 'warning'
            })
        
        return Response({
            'budgets': budget_overviews,
            'summary': {
                'total_budgets': len(budget_overviews),
                'over_budget_count': len([b for b in budget_overviews if b['is_over_budget']]),
                'warning_count': len([b for b in budget_overviews if b['status'] == 'warning']),
                'on_track_count': len([b for b in budget_overviews if b['status'] == 'on_track'])
            }
        })

class BudgetCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Optionally filter by budget via query param
        budget_id = self.request.query_params.get('budget')
        qs = BudgetCategory.objects.all()
        if budget_id:
            qs = qs.filter(budget__id=budget_id, budget__user=self.request.user)
        else:
            qs = qs.filter(budget__user=self.request.user)
        return qs

class BudgetAlertViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetAlertSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Optionally filter by budget_category via query param
        category_id = self.request.query_params.get('budget_category')
        qs = BudgetAlert.objects.all()
        if category_id:
            qs = qs.filter(budget_category__id=category_id, budget_category__budget__user=self.request.user)
        else:
            qs = qs.filter(budget_category__budget__user=self.request.user)
        return qs
