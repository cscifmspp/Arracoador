from django.http import JsonResponse
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth import authenticate, get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Profile
from .influx_services import get_sensor_data
import uuid

User = get_user_model()

@api_view(['GET'])
def hello_api(request):
    return Response({"mensagem": "Olá do Django API!"})

def sensor_data_view(request):
    data = get_sensor_data()
    return JsonResponse({"data": data})


class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if User.objects.filter(username=username).exists():
            return Response({"error": "Usuário já existe"}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        user.is_active = False
        user.save()

        verification_token = str(uuid.uuid4())
        user.profile.verification_token = verification_token
        user.profile.save()

        verification_link = f"http://127.0.0.1:8000/api/auth/verify-email/{verification_token}/"

        send_mail(
            'Verifique seu e-mail',
            f'Clique no link para verificar: {verification_link}',
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        return Response({"message": "Usuário criado. Verifique seu e-mail."}, status=status.HTTP_201_CREATED)


class VerifyEmailView(APIView):
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
            return Response({"error": "Token inválido"}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Usuário não encontrado"}, status=status.HTTP_404_NOT_FOUND)

        user = authenticate(username=user.username, password=password)

        if user is not None:
            return Response({"message": "Login bem-sucedido"}, status=status.HTTP_200_OK)
        return Response({"error": "Credenciais inválidas"}, status=status.HTTP_401_UNAUTHORIZED)
