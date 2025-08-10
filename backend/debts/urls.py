from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
# Future API endpoints will be registered here
# router.register(r'debt-transactions', views.DebtTransactionViewSet)

app_name = 'debts'

urlpatterns = [
    path('api/', include(router.urls)),
    # Add additional URL patterns here as needed
] 