from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserViewSet, UserSettingsViewSet
from .auth_views import (
    request_password_reset,
    reset_password,
    verify_email,
    change_password,
    deactivate_account,
    reactivate_account
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'user-settings', UserSettingsViewSet, basename='user-settings')

urlpatterns = [
    # Authentication
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Password Management
    path('password-reset-request/', request_password_reset, name='password_reset_request'),
    path('password-reset/', reset_password, name='password_reset'),
    path('change-password/', change_password, name='change_password'),
    
    # Email Verification
    path('verify-email/', verify_email, name='verify_email'),
    
    # Account Management
    path('deactivate-account/', deactivate_account, name='deactivate_account'),
    path('reactivate-account/', reactivate_account, name='reactivate_account'),
] + router.urls 