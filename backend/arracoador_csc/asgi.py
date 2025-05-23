"""
ASGI config for arracoador_csc project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""
# arracoador_csc/asgi.py
import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import backend_arracoador.routing  # Importamos o routing da app

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'arracoador_csc.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(backend_arracoador.routing.websocket_urlpatterns),
})
from .server_banner import show_server_banner
show_server_banner()
