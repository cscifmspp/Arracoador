import sys
print("Sys.path:")
for p in sys.path:
    print(p)

print("\nTentando importar...")
try:
    from rest_framework_simplejwt.tokens import RefreshToken
    print("✅ Importação bem-sucedida!")
except ImportError as e:
    print(f"❌ Erro: {e}")
    print("\nConteúdo do diretório rest_framework_simplejwt:")
    import os
    path = os.path.join(sys.path[-1], 'rest_framework_simplejwt')
    print(f"Verificando: {path}")
    if os.path.exists(path):
        print(os.listdir(path))
    else:
        print("Diretório não encontrado!")
