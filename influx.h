#if defined(ESP32)
#include <WiFiMulti.h>
WiFiMulti wifiMulti;
#define DEVICE "ESP32"
#elif defined(ESP8266)
#include <ESP8266WiFiMulti.h>
ESP8266WiFiMulti wifiMulti;
#define DEVICE "ESP8266"
#endif

#include <InfluxDbClient.h>
#include <InfluxDbCloud.h>

#define WIFI_SSID "BISPO-NOT"     // WiFi SSID
#define WIFI_PASSWORD "03070406"  // WiFi password

#define INFLUXDB_URL "https://us-east-1-1.aws.cloud2.influxdata.com"
#define INFLUXDB_TOKEN "f82NDO58VsbiVHr1dYEDoa_o2uhnbiy3UJFKl5b9ccJ0D2uBwoUQ6HfdoLeOfwLgP1LaHs5ISVMP95SLt9j-Bg=="
#define INFLUXDB_ORG "17f5cf93bf4a15ee"  // nome da organizacao
#define INFLUXDB_BUCKET "arracoador"     // nome bucket(banco de dados)

#define TZ_INFO "UTC-4"  // Time zone info // Informacao de zona do horario

// Declare InfluxDB client instance with preconfigured InfluxCloud certificate
// Declarando instancia cliente do InfluxDB pre confiogurado o certificado do InfluxCloud
InfluxDBClient client(INFLUXDB_URL, INFLUXDB_ORG, INFLUXDB_BUCKET, INFLUXDB_TOKEN, InfluxDbCloud2CACert);

Point sensor("arracoador");  // Declare Data point // Declarando ponto(tabela) de dados

void influxSend(char* device, float temp, float tds, float peso, char* rtc) {
  // Garante que o ponto está limpo antes de usar
  sensor.clearTags();
  sensor.clearFields();

  // Adiciona tags e campos ANTES de enviar
  sensor.addTag("device", device);
  sensor.addField("temperatura", temp);
  sensor.addField("balanca", peso);
  sensor.addField("horario", rtc);
  sensor.addField("tdsMetter", tds);

  // Checa conexão WiFi
  if (wifiMulti.run() != WL_CONNECTED) {
    Serial.println("Wifi connection lost");
  }

  // Imprime a linha que será enviada
  Serial.print("Writing: ");
  Serial.println(sensor.toLineProtocol());

  // Envia o ponto
  if (!client.writePoint(sensor)) {
    Serial.print("InfluxDB write failed: ");
    Serial.println(client.getLastErrorMessage());
  }
}
