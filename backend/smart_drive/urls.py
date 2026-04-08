from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.routers import DefaultRouter
from accounts.views import RegisterView, AdminLoginView, UserProfileView, EmergencyContactViewSet, AdminLoginView

from accounts.views import *
from vehicles.views import VehicleViewSet, AdminVehicleViewSet
from trips.views import TripViewSet, AdminTripViewSet
from alerts.views import UserAlertViewSet, AdminAlertViewSet, AdminAlertDefinitionViewSet
from system_settings.views import SystemSettingViewSet
from analytics.views import OverviewView, AlertsSummaryView, RiskTrendsView, TripFeedbackView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

user_router = DefaultRouter()
user_router.register(r'vehicles', VehicleViewSet, basename='user-vehicles')
user_router.register(r'emergency-contacts', EmergencyContactViewSet, basename='user-emergency-contacts')

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='login'),

    path('api/auth/admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('api/auth/change-password/', ChangePasswordView.as_view(), name='change-password'),

    path('api/user/profile/', UserProfileView.as_view(), name='user-profile'),

    path('api/user/vehicles/', VehicleViewSet.as_view({'get': 'list', 'post': 'create'}), name='user-vehicles-list'),
    path('api/user/vehicles/<int:pk>/', VehicleViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='user-vehicles-detail'),

    path('api/admin/vehicles/', AdminVehicleViewSet.as_view({'get': 'list'}), name='admin-vehicles-list'),
    path('api/admin/vehicles/<int:pk>/', AdminVehicleViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='admin-vehicles-detail'),

    path('api/user/emergency-contacts/send-alert/', SendEmergencyAlertView.as_view(), name='send-emergency-alert'),
    path('api/user/emergency-contacts/', EmergencyContactViewSet.as_view({'get': 'list', 'post': 'create'}), name='user-contacts-list'),
    path('api/user/emergency-contacts/<int:pk>/', EmergencyContactViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='user-contacts-detail'),

    path('api/user/trips/', TripViewSet.as_view({'get': 'list', 'post': 'create'}), name='user-trips-list'),
    path('api/user/trips/<int:pk>/', TripViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='user-trips-detail'),

    path('api/user/alerts/', UserAlertViewSet.as_view({'get': 'list', 'post': 'create'}), name='user-alerts-list'),
    path('api/user/alerts/<int:pk>/', UserAlertViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='user-alerts-detail'),

    path('api/admin/dashboard/', OverviewView.as_view(), name='admin-dashboard'),

    path('api/admin/trips/', AdminTripViewSet.as_view({'get': 'list'}), name='admin-trips-list'),
    path('api/admin/trips/<int:pk>/', AdminTripViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='admin-trips-detail'),

    path('api/admin/users/', AdminUserViewSet.as_view({'get': 'list'}), name='admin-users-list'),
    path('api/admin/users/<int:pk>/', AdminUserViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='admin-users-detail'),
    path('api/admin/users/<int:pk>/status/', AdminUserViewSet.as_view({'patch': 'partial_update'}), name='admin-users-status'),

    path('api/admin/alerts/', AdminAlertViewSet.as_view({'get': 'list'}), name='admin-alerts-list'),
    path('api/admin/alert-types/', AdminAlertDefinitionViewSet.as_view({'get': 'list'}), name='admin-alert-types-list'),
    path('api/admin/alert-types/<int:pk>/', AdminAlertDefinitionViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='admin-alert-types-detail'),

    path('api/admin/system-settings/', SystemSettingViewSet.as_view({'get': 'list', 'post': 'create'}), name='admin-settings-list'),
    path('api/admin/system-settings/<int:pk>/', SystemSettingViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='admin-settings-detail'),

    path('api/analytics/overview/', OverviewView.as_view(), name='analytics-overview'),
    path('api/analytics/alerts-summary/', AlertsSummaryView.as_view(), name='analytics-alerts-summary'),
    path('api/analytics/risk-trends/', RiskTrendsView.as_view(), name='analytics-risk-trends'),
    path('api/analytics/trip-feedback/<int:trip_id>/', TripFeedbackView.as_view(), name='analytics-trip-feedback'),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]