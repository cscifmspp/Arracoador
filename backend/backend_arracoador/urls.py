from django.urls import path
from backend_arracoador.views import sensor_data_view
from .views import RegisterView, LoginView

urlpatterns = [
    path('api/sensor-data/', sensor_data_view),
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
]
