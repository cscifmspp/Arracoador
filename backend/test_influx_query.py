import os
import django
from backend_arracoador.influx_services import get_sensor_data # type: ignore

# Configura o Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "arracoador_csc.settings")  # ajuste se o nome do seu projeto for diferente
django.setup()


def main():
    print("Consultando InfluxDB...\n")
    data = get_sensor_data()

    if not data:
        print("⚠️ Nenhum dado retornado.")
    else:
        for entry in data:
            print(f"⏰ {entry['time']} | 🔧 {entry['field']} = {entry['value']}")

if __name__ == "__main__":
    main()
