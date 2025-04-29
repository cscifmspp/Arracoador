# backend_arracoador/routing.py
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/arracoador/$', consumers.ArracoadorConsumer.as_asgi()),
]
