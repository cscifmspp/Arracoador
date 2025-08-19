import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_arracoador.settings')
django.setup()

from rest_framework_simplejwt.tokens import RefreshToken
print("✅ Importação OK - Tudo funcionando!")