from django.urls import path
from .views import RegisterView, LoginView, VerifyEmailView,hello_api

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("verify-email/<str:token>/", VerifyEmailView.as_view(), name="verify-email")
]
