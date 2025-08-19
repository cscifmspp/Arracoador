# backend_arracoador/urls/profile.py
from django.urls import path
from backend_arracoador.views import get_profile, update_profile  # <-- caminho correto

urlpatterns = [
    path("", get_profile, name="user-profile"),
    path("update/", update_profile, name="update-profile"),
]
