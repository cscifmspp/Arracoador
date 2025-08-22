#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "HX711.h"
#include "tdsMetter.h"
#include "temperatura.h"

// -------- CONFIG Wi-Fi --------
const char* ssid = "cadu";
const char* password = "cadu12345";

// -------- SERVER WEB --------
ESP8266WebServer server(80);

// -------- BALANÇA (HX711) --------
#define pinDT 14   // D5
#define pinSCK 12  // D6
float fator_calibracao = 48100;
HX711 escala;

// -------- MOTOR --------
const int pinMotor = 15; // D8
const unsigned long TEMPO_POR_VOLTA = 1000;

// -------- FUNÇÕES --------
double pesar() {
  escala.set_scale(fator_calibracao);
  const int n = 10;
  float soma = 0;
  for (int i = 0; i < n; i++) {
    soma += escala.get_units(1);
    delay(50);
  }
  float pesoKG = soma / n;
  if (pesoKG < 0) pesoKG = 0.0;
  return pesoKG;
}

void girarMotor(int voltas) {
  digitalWrite(pinMotor, LOW);
  delay(voltas * TEMPO_POR_VOLTA);
  digitalWrite(pinMotor, HIGH);
}

void alimentar() {
  digitalWrite(13, HIGH); // D7 - Prato
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}

// -------- SETUP --------
void setup() {
  Serial.begin(115200);
  delay(1000);

  // Inicializar pins
  pinMode(pinMotor, OUTPUT);
  pinMode(13, OUTPUT); // Prato
  digitalWrite(pinMotor, HIGH); // Motor desligado
  digitalWrite(13, LOW); // Prato desligado

  // Inicializar balança
  escala.begin(pinDT, pinSCK);
  escala.set_scale(fator_calibracao);
  escala.tare();

  // Inicializar sensores
  dTemp.begin();
  tdsInit();

  // Conectar WiFi
  WiFi.begin(ssid, password);
  Serial.print("Conectando ao WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado ao WiFi!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  // Configurar rotas do servidor
  server.on("/", []() {
    String html = "<html><head><meta charset='UTF-8'><title>Arraçoador</title></head><body>";
    html += "<h1>Sistema Arraçoador</h1>";
    html += "<p>IP: " + WiFi.localIP().toString() + "</p>";
    html += "<p>Endpoints:</p><ul>";
    html += "<li><a href='/peso'>/peso</a> - Peso atual</li>";
    html += "<li><a href='/tds'>/tds</a> - TDS da água</li>";
    html += "<li><a href='/temperatura'>/temperatura</a> - Temperatura</li>";
    html += "<li><a href='/motor/on'>/motor/on</a> - Ligar motor</li>";
    html += "<li><a href='/motor/off'>/motor/off</a> - Desligar motor</li>";
    html += "</ul></body></html>";
    
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/html", html);
  });

  server.on("/peso", []() {
    double p = pesar();
    String json = "{\"peso\":" + String(p, 3) + "}";
    
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", json);
  });

  server.on("/tds", []() {
    float tds = tdsMetter();
    String json = "{\"tds\":" + String(tds, 2) + "}";
    
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", json);
  });

  server.on("/temperatura", []() {
    float temp = temperatura();
    String json = "{\"temperatura\":" + String(temp, 2) + "}";
    
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", json);
  });

  server.on("/motor/on", []() {
    digitalWrite(pinMotor, LOW);
    
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", "Motor ligado");
  });

  server.on("/motor/off", []() {
    digitalWrite(pinMotor, HIGH);
    
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", "Motor desligado");
  });

  server.onNotFound([]() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(404, "text/plain", "Endpoint não encontrado");
  });

  server.begin();
  Serial.println("Servidor HTTP iniciado!");
}

// -------- LOOP --------
void loop() {
  server.handleClient();
  
  // Atualizar temperatura para compensação TDS
  setWaterTemperature(temperatura());
  
  // Log a cada 30 segundos
  static unsigned long lastLog = 0;
  if (millis() - lastLog > 30000) {
    Serial.println("Peso: " + String(pesar(), 3) + " kg");
    Serial.println("TDS: " + String(tdsMetter(), 2) + " ppm");
    Serial.println("Temp: " + String(temperatura(), 2) + " °C");
    Serial.println("-------------------");
    lastLog = millis();
  }

  alimentar();
  delay(1000);
}