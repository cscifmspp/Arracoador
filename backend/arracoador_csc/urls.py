from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("backend_arracoador.auth_urls")),  # Arquivo que você criou para as views de auth
    #path("api/sensor-data/", include("backend_arracoador.sensor_urls")),  # Se tiver rotas de sensores
]
