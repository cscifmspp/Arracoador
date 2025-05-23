# from django.shortcuts import render
# from django.http import HttpResponse
# # Create your views here.
# def HelloWorld(request):
#     return HttpResponse("Testando Backend do Arracoador!")
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def hello_api(request):
    return Response({"mensagem": "Olá do Django API!"})

from django.http import JsonResponse
from .influx_services import get_sensor_data

def sensor_data_view(request):
    data = get_sensor_data()
    return JsonResponse({"data": data})
