# backend_arracoador/urls/utility.py
from django.urls import path
from backend_arracoador.views import test_connection, hello_api,sensor_data_view,SensorView
urlpatterns = [
    path("test/", test_connection, name="test-connection"),
    path("hello/", hello_api, name="hello-api"),
    path("sensor-data/", sensor_data_view, name="sensor-data"),
    path("api/sensores/", SensorView.as_view(), name="sensores"),

]