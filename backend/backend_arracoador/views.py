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

                # CORREÇÃO: Primeiro verifica se usuário existe
                try:
                    user = User.objects.get(email=email)
                    created = False
                except User.DoesNotExist:
                    # Cria novo usuário
                    user = User.objects.create(
                        email=email,
                        username=email.split('@')[0],
                        first_name=first_name,
                        is_active=False
                    )
                    created = True

                # ⚠️ CORREÇÃO CRÍTICA: SEMPRE define a senha
                user.set_password(password)  # Isso criptografa a senha
                user.first_name = first_name
                user.is_active = False
                user.save()  # ⚠️ SALVA as alterações

                # Gera token de verificação
                token = str(uuid.uuid4())
                Profile.objects.update_or_create(
                    user=user,
                    defaults={
                        'phone': phone,
                        'verification_token': token
                    }
                )

                return self._send_verification_email(user, token)

        except Exception as e:
            logger.error(f"Erro no registro: {str(e)}")
            return Response(
                {"status": "error", "message": "Erro durante o registro"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def _send_verification_email(self, user, token):
        try:
            # URL CORRETA - backend é quem processa a verificação
            verification_link = f"{settings.BACKEND_URL}/api/auth/verify-email/{token}/"
            
            print(f"\n=== DEBUG: LINK DE VERIFICAÇÃO ===")
            print(f"Email: {user.email}")
            print(f"Link: {verification_link}")
            print("===================================\n")

            # SEMPRE tenta enviar email, mas em desenvolvimento mostra no console
            subject = 'Ative sua conta - Arraçoador'
            message = f'''
            Olá {user.first_name},

            Para ativar sua conta, clique no link abaixo:

            {verification_link}

            Se você não criou esta conta, ignore este email.

            Atenciosamente,
            Equipe Arraçoador
            '''

            # Tenta enviar o email
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,  # Isso vai mostrar erros se houver
            )

            print(f"✅ Email enviado para: {user.email}")

            # Retorna resposta com link para desenvolvimento
            response_data = {
                "status": "success",
                "message": "Conta criada! Verifique seu email para ativar."
            }
            
            if settings.DEBUG:
                response_data["dev_link"] = verification_link
                response_data["dev_message"] = "Modo desenvolvimento: use o link acima"

            return Response(response_data, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            print(f"❌ ERRO ao enviar email: {str(e)}")
            
            # Em caso de erro, ainda retorna sucesso com o link
            verification_link = f"{settings.BACKEND_URL}/api/auth/verify-email/{token}/"
            return Response({
                "status": "success",
                "message": "Conta criada! Use o link abaixo para ativar:",
                "dev_link": verification_link,
                "error": f"Falha no email: {str(e)}" if settings.DEBUG else None
            }, status=status.HTTP_201_CREATED)
        
class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            profile = Profile.objects.get(verification_token=token)
            user = profile.user
            user.is_active = True
            user.save()
            profile.verification_token = None
            profile.save()
            return Response(
                {"status": "success", "message": "Email verificado com sucesso!"},
                status=status.HTTP_200_OK
            )
        except Profile.DoesNotExist:
            return Response(
                {"status": "error", "message": "Token inválido ou expirado"},
                status=status.HTTP_400_BAD_REQUEST
            )

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        print(f"Tentativa de login: {email}")  # DEBUG

        if not email or not password:
            return Response(
                {"status": "error", "message": "Email e senha são obrigatórios"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
            print(f"Usuário encontrado: {user.email}, Ativo: {user.is_active}")  # DEBUG
            
            if not user.is_active:
                print("Usuário não está ativo!")  # DEBUG
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
            print(f"Autenticação resultou: {authenticated_user}")  # DEBUG
            
            if not authenticated_user:
                print("Falha na autenticação - senha incorreta")  # DEBUG
                return Response(
                    {"status": "error", "message": "Credenciais inválidas"},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            refresh = RefreshToken.for_user(authenticated_user)
            print("Login bem-sucedido, gerando tokens")  # DEBUG
            
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
            print("Usuário não encontrado")  # DEBUG
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
        profile = Profile.objects.get(user=user)
        
        response_data = {
            'status': 'success',
            'first_name': user.first_name,
            'email': user.email,
            'phone': profile.phone,
            'nome': user.first_name,
            'telefone': profile.phone,
        }
        
        if profile.photo:
            response_data['profile_photo'] = request.build_absolute_uri(profile.photo.url)
            response_data['foto_perfil'] = request.build_absolute_uri(profile.photo.url)
            
        return Response(response_data)
    
    except Profile.DoesNotExist:
        return Response(
            {"status": "error", "message": "Perfil não encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Erro ao buscar perfil: {str(e)}")
        return Response(
            {"status": "error", "message": "Erro ao buscar perfil"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_profile(request):
    try:
        user = request.user
        profile = Profile.objects.get(user=user)
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

        if 'foto_perfil' in request.FILES:
            if profile.photo:
                default_storage.delete(profile.photo.path)
            profile.photo = request.FILES['foto_perfil']
            updated_fields.append('photo')

        if updated_fields:
            user.save()
            profile.save()

        response_data = {
            'status': 'success',
            'message': 'Perfil atualizado com sucesso',
            'user': {
                'first_name': user.first_name,
                'email': user.email,
                'phone': profile.phone,
                'profile_photo': request.build_absolute_uri(profile.photo.url) if profile.photo else None
            }
        }
        
        return Response(response_data)
        
    except Profile.DoesNotExist:
        return Response(
            {"status": "error", "message": "Perfil não encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Erro ao atualizar perfil: {str(e)}")
        return Response(
            {"status": "error", "message": "Erro ao atualizar perfil"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )