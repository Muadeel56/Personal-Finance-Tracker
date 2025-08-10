from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.DebtTransactionViewSet, basename='debt-transactions')

app_name = 'debts'

urlpatterns = [
    path('', include(router.urls)),
] 