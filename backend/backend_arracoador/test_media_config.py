import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'arracoador_csc.settings')
django.setup()

print("=== CONFIGURAÇÃO DE MÍDIA ===")
print(f"MEDIA_ROOT: {settings.MEDIA_ROOT}")
print(f"MEDIA_URL: {settings.MEDIA_URL}")
print(f"DEBUG: {settings.DEBUG}")

# Verifica se o diretório existe
media_exists = os.path.exists(settings.MEDIA_ROOT)
print(f"MEDIA_ROOT existe: {media_exists}")

# Tenta criar um arquivo de teste
if media_exists:
    test_dir = os.path.join(settings.MEDIA_ROOT, 'profile_photos')
    os.makedirs(test_dir, exist_ok=True)
    
    test_file = os.path.join(test_dir, 'test.txt')
    with open(test_file, 'w') as f:
        f.write('test file content')
    
    print(f"Arquivo de teste criado: {test_file}")
    print(f"Arquivo existe: {os.path.exists(test_file)}")