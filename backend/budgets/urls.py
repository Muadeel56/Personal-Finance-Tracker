from rest_framework.routers import DefaultRouter
from .views import BudgetViewSet, BudgetCategoryViewSet, BudgetAlertViewSet

router = DefaultRouter()
router.register(r'budgets', BudgetViewSet, basename='budgets')
router.register(r'budget-categories', BudgetCategoryViewSet, basename='budget-categories')
router.register(r'budget-alerts', BudgetAlertViewSet, basename='budget-alerts')

urlpatterns = router.urls 