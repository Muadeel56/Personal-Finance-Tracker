from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Budget, BudgetCategory, BudgetAlert
from .serializers import BudgetSerializer, BudgetCategorySerializer, BudgetAlertSerializer

# Create your views here.

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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
