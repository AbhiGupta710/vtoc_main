from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView,)
from rest_framework.routers import DefaultRouter
from api_app import views

urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register_user/', views.register, name='register'),
]


router = DefaultRouter()
router.register(r"user", views.UserViewSet, basename="user")
router.register(r"tryon", views.TryOnModelViewSet, basename='tryon')

urlpatterns += router.urls
