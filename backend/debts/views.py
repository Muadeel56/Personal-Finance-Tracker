from django.shortcuts import render
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Sum, Count, Q
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
import django_filters
from datetime import datetime, timedelta

from .models import DebtTransaction
from .serializers import (
    DebtTransactionSerializer,
    DebtTransactionListSerializer,
    DebtTransactionCreateSerializer,
    DebtTransactionUpdateSerializer
)


class DebtTransactionFilter(django_filters.FilterSet):
    """Filter for debt transactions"""
    transaction_type = django_filters.ChoiceFilter(choices=DebtTransaction.TRANSACTION_TYPES)
    status = django_filters.ChoiceFilter(choices=DebtTransaction.STATUS_CHOICES)
    person_name = django_filters.CharFilter(lookup_expr='icontains')
    
    # Date range filters
    due_date_from = django_filters.DateFilter(field_name='due_date', lookup_expr='gte')
    due_date_to = django_filters.DateFilter(field_name='due_date', lookup_expr='lte')
    created_at_from = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_at_to = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    
    # Amount range filters
    amount_min = django_filters.NumberFilter(field_name='amount', lookup_expr='gte')
    amount_max = django_filters.NumberFilter(field_name='amount', lookup_expr='lte')
    
    class Meta:
        model = DebtTransaction
        fields = [
            'transaction_type', 'status', 'person_name',
            'due_date_from', 'due_date_to',
            'created_at_from', 'created_at_to',
            'amount_min', 'amount_max'
        ]


class DebtTransactionPagination(PageNumberPagination):
    """Custom pagination for debt transactions"""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class DebtTransactionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing debt transactions.
    
    Provides CRUD operations and additional actions for debt management:
    - Standard CRUD operations
    - Mark debt as paid
    - Get debt statistics
    - Get overdue debts
    - Filtering and sorting capabilities
    """
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = DebtTransactionPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = DebtTransactionFilter
    ordering_fields = ['due_date', 'amount', 'created_at', 'person_name']
    ordering = ['-created_at']  # Default ordering
    search_fields = ['person_name', 'description', 'contact_info']

    def get_queryset(self):
        """Return debt transactions for the authenticated user only"""
        return DebtTransaction.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'list':
            return DebtTransactionListSerializer
        elif self.action == 'create':
            return DebtTransactionCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return DebtTransactionUpdateSerializer
        return DebtTransactionSerializer

    def perform_create(self, serializer):
        """Set the user when creating a debt transaction"""
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """Ensure user ownership when updating"""
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        """
        Mark a debt transaction as paid.
        
        POST /api/debts/{id}/mark_paid/
        """
        debt = self.get_object()
        
        if debt.status == 'PAID':
            return Response(
                {'detail': 'Debt is already marked as paid.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        debt.status = 'PAID'
        debt.paid_date = timezone.now()
        debt.save()
        
        serializer = self.get_serializer(debt)
        return Response({
            'detail': 'Debt marked as paid successfully.',
            'debt': serializer.data
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Get debt summary statistics for the authenticated user.
        
        GET /api/debts/statistics/
        
        Returns:
        - Total amounts for different transaction types and statuses
        - Count of debts by status
        - Average debt amount
        - Overdue statistics
        """
        queryset = self.get_queryset()
        
        # Basic statistics
        total_stats = queryset.aggregate(
            total_amount=Sum('amount'),
            total_count=Count('id'),
        )
        
        # Statistics by transaction type
        need_to_give_stats = queryset.filter(transaction_type='NEED_TO_GIVE').aggregate(
            total_amount=Sum('amount'),
            count=Count('id'),
            unpaid_amount=Sum('amount', filter=Q(status__in=['UNPAID', 'OVERDUE'])),
            unpaid_count=Count('id', filter=Q(status__in=['UNPAID', 'OVERDUE']))
        )
        
        need_to_get_stats = queryset.filter(transaction_type='NEED_TO_GET').aggregate(
            total_amount=Sum('amount'),
            count=Count('id'),
            unpaid_amount=Sum('amount', filter=Q(status__in=['UNPAID', 'OVERDUE'])),
            unpaid_count=Count('id', filter=Q(status__in=['UNPAID', 'OVERDUE']))
        )
        
        # Statistics by status
        status_stats = {}
        for status_code, status_name in DebtTransaction.STATUS_CHOICES:
            stats = queryset.filter(status=status_code).aggregate(
                count=Count('id'),
                total_amount=Sum('amount')
            )
            status_stats[status_code.lower()] = {
                'count': stats['count'] or 0,
                'total_amount': float(stats['total_amount'] or 0)
            }
        
        # Overdue statistics
        overdue_queryset = queryset.filter(
            due_date__lt=timezone.now().date(),
            status__in=['UNPAID', 'OVERDUE']
        )
        overdue_stats = overdue_queryset.aggregate(
            count=Count('id'),
            total_amount=Sum('amount')
        )
        
        # Average debt amount
        avg_amount = float(total_stats['total_amount'] or 0) / max(total_stats['total_count'] or 1, 1)
        
        return Response({
            'total_statistics': {
                'total_amount': float(total_stats['total_amount'] or 0),
                'total_count': total_stats['total_count'] or 0,
                'average_amount': round(avg_amount, 2)
            },
            'by_transaction_type': {
                'need_to_give': {
                    'total_amount': float(need_to_give_stats['total_amount'] or 0),
                    'count': need_to_give_stats['count'] or 0,
                    'unpaid_amount': float(need_to_give_stats['unpaid_amount'] or 0),
                    'unpaid_count': need_to_give_stats['unpaid_count'] or 0
                },
                'need_to_get': {
                    'total_amount': float(need_to_get_stats['total_amount'] or 0),
                    'count': need_to_get_stats['count'] or 0,
                    'unpaid_amount': float(need_to_get_stats['unpaid_amount'] or 0),
                    'unpaid_count': need_to_get_stats['unpaid_count'] or 0
                }
            },
            'by_status': status_stats,
            'overdue': {
                'count': overdue_stats['count'] or 0,
                'total_amount': float(overdue_stats['total_amount'] or 0)
            }
        })

    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """
        Get overdue debt transactions for the authenticated user.
        
        GET /api/debts/overdue/
        
        Returns paginated list of overdue debts sorted by due date (oldest first).
        """
        # Filter for overdue debts
        overdue_queryset = self.get_queryset().filter(
            due_date__lt=timezone.now().date(),
            status__in=['UNPAID', 'OVERDUE']
        ).order_by('due_date')
        
        # Apply pagination
        page = self.paginate_queryset(overdue_queryset)
        if page is not None:
            serializer = DebtTransactionListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = DebtTransactionListSerializer(overdue_queryset, many=True)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        """
        List debt transactions with enhanced response including summary.
        
        GET /api/debts/
        """
        response = super().list(request, *args, **kwargs)
        
        # Add summary information to the response
        queryset = self.filter_queryset(self.get_queryset())
        total_amount = queryset.aggregate(Sum('amount'))['amount__sum'] or 0
        total_count = queryset.count()
        
        response.data['summary'] = {
            'total_count': total_count,
            'total_amount': float(total_amount),
            'filtered_count': len(response.data['results']) if 'results' in response.data else total_count
        }
        
        return response

    def destroy(self, request, *args, **kwargs):
        """
        Delete a debt transaction with confirmation message.
        
        DELETE /api/debts/{id}/
        """
        instance = self.get_object()
        person_name = instance.person_name
        amount = instance.amount
        
        self.perform_destroy(instance)
        
        return Response({
            'detail': f'Debt transaction for {person_name} (${amount}) has been deleted successfully.'
        }, status=status.HTTP_200_OK)
