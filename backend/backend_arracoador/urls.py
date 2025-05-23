from django.urls import path
from backend_arracoador.views import sensor_data_view

urlpatterns = [
    path('api/sensor-data/', sensor_data_view),
]
