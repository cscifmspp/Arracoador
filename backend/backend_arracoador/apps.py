from django.apps import AppConfig

class BackendArracoadorConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend_arracoador'  # Este deve corresponder ao nome da pasta do seu app

    def ready(self):
        # Importe os signals se existirem
        try:
            import backend_arracoador.signals
        except ImportError:
            pass