# from django.shortcuts import render
# from django.http import HttpResponse
# # Create your views here.
# def HelloWorld(request):
#     return HttpResponse("Testando Backend do Arracoador!")
from rest_framework.decorators import api_view
from rest_framework.response import Response

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

@api_view(['GET'])
def hello_api(request):
    return Response({"mensagem": "Olá do Django API!"})

from django.http import JsonResponse
from .influx_services import get_sensor_data

def sensor_data_view(request):
    data = get_sensor_data()
    return JsonResponse({"data": data})


class RegisterView(APIView):
    def post(self, request):
        email = request.data.get("email")
        username = email  # se quiser usar email como username
        password = request.data.get("password")

        if User.objects.filter(username=username).exists():
            return Response({"error": "Usuário já existe."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({"message": "Usuário criado com sucesso."}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(username=email, password=password)

        if user is not None:
            return Response({"message": "Login bem-sucedido"}, status=status.HTTP_200_OK)
        return Response({"error": "Credenciais inválidas"}, status=status.HTTP_401_UNAUTHORIZED)
