from django.http import JsonResponse
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth import authenticate, get_user_model
from django.core.files.storage import default_storage
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Profile
from .influx_services import get_sensor_data
import uuid
import logging
import os
import random
from datetime import timedelta
from django.utils import timezone

logger = logging.getLogger(__name__)
User = get_user_model()

# ====================== TESTE DE CONEXÃO ======================
@api_view(['GET'])
@permission_classes([AllowAny])
def hello_api(request):
    return Response({"mensagem": "Olá do Django API!"})

@api_view(['GET'])
@permission_classes([AllowAny])
def test_connection(request):
    return Response({"status": "success", "message": "Conexão estabelecida"})

# ====================== DADOS DE SENSORES ======================
@api_view(['GET'])
@permission_classes([AllowAny])
def sensor_data_view(request):
    try:
        data = get_sensor_data()
        return JsonResponse({"status": "success", "data": data})
    except Exception as e:
        logger.error(f"Erro ao buscar dados de sensor: {str(e)}")
        return Response(
            {"status": "error", "message": "Falha ao obter dados do sensor"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# ====================== AUTENTICAÇÃO ======================

# views.py - Mantenha o LoginView original e modifique apenas o registro
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        phone = request.data.get('phone', '')

        if not email or not password:
            return Response(
                {"status": "error", "message": "Email e senha são obrigatórios"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                # Verifica se usuário já existe e está ativo
                if User.objects.filter(email=email, is_active=True).exists():
                    return Response(
                        {"status": "error", "message": "Email já cadastrado"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Verifica se usuário existe mas não está ativo (registro pendente)
                try:
                    user = User.objects.get(email=email, is_active=False)
                    created = False
                except User.DoesNotExist:
                    # Cria novo usuário
                    user = User.objects.create(
                        email=email,
                        username=email.split('@')[0],
                        first_name=first_name,
                        is_active=False  # IMPORTANTE: usuário fica inativo até verificação
                    )
                    created = True

                user.set_password(password)
                user.first_name = first_name
                user.save()

                # Gera código de verificação numérico (6 dígitos)
                verification_code = str(random.randint(100000, 999999))
                expires_at = timezone.now() + timedelta(minutes=15)

                Profile.objects.update_or_create(
                    user=user,
                    defaults={
                        'phone': phone,
                        'verification_code': verification_code,
                        'verification_code_expires': expires_at
                    }
                )

                return self._send_verification_code(user, verification_code)

        except Exception as e:
            logger.error(f"Erro no registro: {str(e)}")
            return Response(
                {"status": "error", "message": "Erro durante o registro"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _send_verification_code(self, user, code):
        try:
            subject = 'Seu código de verificação - Arraçoador'
            message = f'''
            Olá {user.first_name},

            Seu código de verificação é: {code}

            Use este código para ativar sua conta. O código expira em 15 minutos.

            Se você não criou esta conta, ignore este email.

            Atenciosamente,
            Equipe Arraçoador
            '''

            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )

            print(f"✅ Código enviado para: {user.email} - Código: {code}")

            return Response({
                "status": "success",
                "message": "Código de verificação enviado para seu email",
                "user_id": user.id,
                "email": user.email
            }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            print(f"❌ ERRO ao enviar email: {str(e)}")
            return Response({
                "status": "error",
                "message": "Erro ao enviar código de verificação"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_id = request.data.get('user_id')
        code = request.data.get('code')

        if not user_id or not code:
            return Response(
                {"status": "error", "message": "ID do usuário e código são obrigatórios"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id, is_active=False)
            profile = Profile.objects.get(user=user)
            
            # Verifica se o código está correto e não expirou
            if (profile.verification_code == code and 
                profile.verification_code_expires > timezone.now()):
                
                # Ativa a conta do usuário
                user.is_active = True
                user.save()
                
                # Limpa o código de verificação
                profile.verification_code = None
                profile.verification_code_expires = None
                profile.save()

                # Gera token JWT para login automático após verificação
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    "status": "success",
                    "message": "Conta ativada com sucesso!",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "first_name": user.first_name
                    }
                }, status=status.HTTP_200_OK)
            
            elif profile.verification_code_expires <= timezone.now():
                return Response(
                    {"status": "error", "message": "Código expirado"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                return Response(
                    {"status": "error", "message": "Código inválido"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except User.DoesNotExist:
            return Response(
                {"status": "error", "message": "Usuário não encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Profile.DoesNotExist:
            return Response(
                {"status": "error", "message": "Perfil não encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

class ResendCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_id = request.data.get('user_id')
        email = request.data.get('email')

        if not user_id and not email:
            return Response(
                {"status": "error", "message": "ID do usuário ou email é obrigatório"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if user_id:
                user = User.objects.get(id=user_id, is_active=False)
            else:
                user = User.objects.get(email=email, is_active=False)

            profile = Profile.objects.get(user=user)

            # Gera novo código
            new_code = str(random.randint(100000, 999999))
            new_expires = timezone.now() + timedelta(minutes=15)

            profile.verification_code = new_code
            profile.verification_code_expires = new_expires
            profile.save()

            # Envia o novo código
            subject = 'Novo código de verificação - Arraçoador'
            message = f'''
            Olá {user.first_name},

            Seu novo código de verificação é: {new_code}

            Use este código para ativar sua conta. O código expira em 15 minutos.

            Atenciosamente,
            Equipe AquaSense
            '''

            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )

            return Response({
                "status": "success",
                "message": "Novo código enviado para seu email",
                "user_id": user.id
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response(
                {"status": "error", "message": "Usuário não encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Profile.DoesNotExist:
            return Response(
                {"status": "error", "message": "Perfil não encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

# MANTENHA O LoginView ORIGINAL - ele continua funcionando com token JWT
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        print(f"Tentativa de login: {email}")

        if not email or not password:
            return Response(
                {"status": "error", "message": "Email e senha são obrigatórios"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
            print(f"Usuário encontrado: {user.email}, Ativo: {user.is_active}")
            
            if not user.is_active:
                print("Usuário não está ativo!")
                return Response(
                    {
                        "status": "error",
                        "message": "Conta não ativada",
                        "detail": "Verifique sua caixa de entrada"
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

            # Tenta autenticar
            authenticated_user = authenticate(username=user.username, password=password)
            print(f"Autenticação resultou: {authenticated_user}")
            
            if not authenticated_user:
                print("Falha na autenticação - senha incorreta")
                return Response(
                    {"status": "error", "message": "Credenciais inválidas"},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            refresh = RefreshToken.for_user(authenticated_user)
            print("Login bem-sucedido, gerando tokens")
            
            return Response({
                "status": "success",
                "message": "Login bem-sucedido",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name
                }
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            print("Usuário não encontrado")
            return Response(
                {"status": "error", "message": "Email não cadastrado"},
                status=status.HTTP_404_NOT_FOUND
            )

# ====================== PERFIL DO USUÁRIO ======================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    try:
        user = request.user
        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            # Cria perfil se não existir
            profile = Profile.objects.create(user=user)
        
        response_data = {
            'status': 'success',
            'first_name': user.first_name,
            'email': user.email,
            'phone': profile.phone,
            'nome': user.first_name,
            'telefone': profile.phone,
        }
        
        # CORREÇÃO: Verifica se a foto existe antes de tentar construir a URL
        if profile.photo:
            try:
                # Verifica se o arquivo físico existe
                if os.path.exists(profile.photo.path):
                    response_data['profile_photo'] = request.build_absolute_uri(profile.photo.url)
                    response_data['foto_perfil'] = request.build_absolute_uri(profile.photo.url)
                else:
                    logger.warning(f"Arquivo de foto não encontrado: {profile.photo.path}")
                    # Remove a referência ao arquivo que não existe
                    profile.photo = None
                    profile.save()
            except Exception as e:
                logger.error(f"Erro ao processar foto: {str(e)}")
                profile.photo = None
                profile.save()
            
        return Response(response_data)
    
    except Exception as e:
        logger.error(f"Erro ao buscar perfil: {str(e)}")
        return Response(
            {"status": "error", "message": "Erro ao buscar perfil"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # CORREÇÃO: IsAuthenticated estava escrito errado
@parser_classes([MultiPartParser, FormParser])
def update_profile(request):
    try:
        user = request.user
        profile, created = Profile.objects.get_or_create(user=user)
        updated_fields = []

        # Padroniza o tratamento dos campos
        first_name = request.data.get('first_name') or request.data.get('nome')
        if first_name and first_name != user.first_name:
            user.first_name = first_name
            updated_fields.append('first_name')

        new_email = request.data.get('email')
        if new_email and new_email != user.email:
            if User.objects.filter(email=new_email).exclude(pk=user.pk).exists():
                return Response(
                    {"status": "error", "message": "Email já está em uso"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.email = new_email
            updated_fields.append('email')

        phone = request.data.get('phone') or request.data.get('telefone')
        if phone and phone != profile.phone:
            profile.phone = phone
            updated_fields.append('phone')

        # CORREÇÃO: Upload de foto com tratamento de erros
        if 'foto_perfil' in request.FILES:
            try:
                # Remove foto antiga se existir
                if profile.photo:
                    try:
                        if os.path.exists(profile.photo.path):
                            default_storage.delete(profile.photo.path)
                    except Exception as e:
                        logger.error(f"Erro ao deletar foto antiga: {str(e)}")
                
                # Salva nova foto
                foto = request.FILES['foto_perfil']
                
                # Gera nome único para o arquivo
                import time
                file_extension = os.path.splitext(foto.name)[1]
                filename = f"profile_{int(time.time())}{file_extension}"
                
                # Salva o arquivo
                profile.photo.save(filename, foto)
                updated_fields.append('photo')
                
                logger.info(f"Foto salva: {profile.photo.path}")
                
            except Exception as e:
                logger.error(f"Erro ao processar upload da foto: {str(e)}")
                return Response(
                    {"status": "error", "message": "Erro ao processar a imagem"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        if updated_fields:
            user.save()
            profile.save()
            logger.info(f"Perfil atualizado. Campos: {updated_fields}")

        # Constrói resposta
        response_data = {
            'status': 'success',
            'message': 'Perfil atualizado com sucesso',
            'user': {
                'first_name': user.first_name,
                'email': user.email,
                'phone': profile.phone,
            }
        }
        
        # Adiciona URL da foto se existir
        if profile.photo:
            try:
                response_data['user']['profile_photo'] = request.build_absolute_uri(profile.photo.url)
                response_data['user']['foto_perfil'] = request.build_absolute_uri(profile.photo.url)
            except Exception as e:
                logger.error(f"Erro ao construir URL da foto: {str(e)}")
        
        return Response(response_data)
        
    except Exception as e:
        logger.error(f"Erro ao atualizar perfil: {str(e)}")
        return Response(
            {"status": "error", "message": "Erro ao atualizar perfil"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# ====================== VIEW PARA DEBUG DE ARQUIVOS ======================
@api_view(['GET'])
@permission_classes([AllowAny])
def debug_media(request):
    """View para debug do sistema de arquivos"""
    media_info = {
        'MEDIA_ROOT': settings.MEDIA_ROOT,
        'MEDIA_URL': settings.MEDIA_URL,
        'DEBUG': settings.DEBUG,
        'media_root_exists': os.path.exists(settings.MEDIA_ROOT),
        'files_in_media': []
    }
    
    # Lista arquivos no diretório media
    if os.path.exists(settings.MEDIA_ROOT):
        for root, dirs, files in os.walk(settings.MEDIA_ROOT):
            for file in files:
                file_path = os.path.join(root, file)
                media_info['files_in_media'].append({
                    'path': file_path,
                    'size': os.path.getsize(file_path),
                    'exists': os.path.exists(file_path)
                })
    
    return Response(media_info)

class SensorView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        temperatura = request.data.get("temperatura")
        tds = request.data.get("tds")
        print(f"Temperatura: {temperatura} °C | TDS: {tds} ppm")

        # Aqui você pode salvar no InfluxDB ou em um modelo Django
        # exemplo fictício:
        # SensorData.objects.create(temperatura=temperatura, tds=tds)

        return Response({"status": "ok", "temperatura": temperatura, "tds": tds})
