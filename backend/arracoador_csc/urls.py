# arracoador_csc/urls.py (principal)
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('backend_arracoador.urls.auth')),
    path('api/profile/', include('backend_arracoador.urls.profile')),
    path('api/utility/', include('backend_arracoador.urls.utility')),

]
# Servir arquivos de mídia durante o desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)