# backend_arracoador/urls/auth.py
from django.urls import path
from backend_arracoador.views import RegisterView, LoginView, VerifyCodeView, ResendCodeView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("verify-code/", VerifyCodeView.as_view(), name="verify-code"),
    path("resend-code/", ResendCodeView.as_view(), name="resend-code"),
]