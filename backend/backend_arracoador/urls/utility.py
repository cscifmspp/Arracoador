# backend_arracoador/urls/utility.py
from django.urls import path
from ..views import (
    test_connection,
    hello_api,
    sensor_data_view
)

urlpatterns = [
    path("test/", test_connection, name="test-connection"),
    path("hello/", hello_api, name="hello-api"),
    path("sensor-data/", sensor_data_view, name="sensor-data"),
]