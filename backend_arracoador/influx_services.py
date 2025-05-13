from influxdb_client import InfluxDBClient
from django.conf import settings

def get_sensor_data():
    print("Influx Config:", settings.INFLUXDB_SETTINGS)
    client = InfluxDBClient(
        url=settings.INFLUXDB_SETTINGS["url"],
        token=settings.INFLUXDB_SETTINGS["token"],
        org=settings.INFLUXDB_SETTINGS["org"],
    )

    query_api = client.query_api()

    query = f'''
    from(bucket: "{settings.INFLUXDB_SETTINGS["bucket"]}")
        |> range(start: -30d)
        |> filter(fn: (r) => r._measurement == "arracoador")
        |> filter(fn: (r) => r._field == "temperatura" or r._field == "tdsMetter")
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: 10)
    '''

    tables = query_api.query(query)
    data = []

    for table in tables:
        for record in table.records:
            data.append({
                "time": record.get_time().isoformat(),
                "field": record.get_field(),
                "value": record.get_value(),
            })

    client.close()
    return data
