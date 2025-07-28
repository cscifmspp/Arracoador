# auth/views.py

from django.http import JsonResponse
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth import authenticate, get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from .models import Profile
from .influx_services import get_sensor_data
import uuid

User = get_user_model()

# ────────────────────────────────────────────────
# HELLO TEST API
# ────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def hello_api(request):
    return Response({"mensagem": "Olá do Django API!"})


# ────────────────────────────────────────────────
# SENSOR DATA API
# ────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def sensor_data_view(request):
    data = get_sensor_data()
    return JsonResponse({"data": data})


# ────────────────────────────────────────────────
# REGISTRO E VERIFICAÇÃO POR EMAIL
# ────────────────────────────────────────────────

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({"error": "Email e senha são obrigatórios"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            existing_user = User.objects.get(email=email)
            if existing_user.is_active:
                return Response({"error": "Email já cadastrado"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return self._send_verification_email(existing_user)
        except User.DoesNotExist:
            username = email.split('@')[0]
            user = User.objects.create_user(username=username, email=email, password=password, is_active=False)
            return self._send_verification_email(user)

    def _send_verification_email(self, user):
        try:
            token = str(uuid.uuid4())
            profile, _ = Profile.objects.get_or_create(user=user)
            profile.verification_token = token
            profile.save()

            link = f"http://192.168.2.14:8000/api/auth/verify-email/{token}/"

            # Envia email independente do DEBUG
            send_mail(
                'Verifique seu e-mail',
                f'Clique para ativar sua conta: {link}',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False
            )

            return Response(
                {"message": "Verifique seu e-mail para ativar sua conta"},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            print(f"Erro ao enviar email: {e}")
            return Response({"error": "Erro ao processar o cadastro"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            profile = Profile.objects.get(verification_token=token)
            user = profile.user
            user.is_active = True
            user.save()
            profile.verification_token = ''
            profile.save()

            return Response({"message": "Email verificado com sucesso!"}, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({"error": "Token inválido ou expirado"}, status=status.HTTP_400_BAD_REQUEST)


# ────────────────────────────────────────────────
# LOGIN
# ────────────────────────────────────────────────

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email e senha são obrigatórios"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)

            if not user.is_active:
                if hasattr(user, 'profile') and user.profile.verification_token:
                    return Response(
                        {"error": "Email não verificado", "detail": "Verifique sua caixa de entrada"},
                        status=status.HTTP_403_FORBIDDEN
                    )
                return Response({"error": "Conta não ativada"}, status=status.HTTP_403_FORBIDDEN)

            user = authenticate(username=user.username, password=password)

            if user:
                return Response({"message": "Login bem-sucedido"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Senha incorreta"}, status=status.HTTP_401_UNAUTHORIZED)

        except User.DoesNotExist:
            return Response({"error": "Email não cadastrado"}, status=status.HTTP_404_NOT_FOUND)
