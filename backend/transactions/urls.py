from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, CategoryViewSet, TransactionViewSet

router = DefaultRouter()
router.register(r'accounts', AccountViewSet, basename='accounts')
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'transactions', TransactionViewSet, basename='transactions')

urlpatterns = router.urls 