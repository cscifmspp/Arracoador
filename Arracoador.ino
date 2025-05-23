#include "balanca.h"
#include "relogio.h"
#include "temperatura.h"
#include "tdsMetter.h"
#include "influx.h"
#include "motores.h"


void setup() {
  Serial.begin(115200);  // iniciando porta Serial / 115200

  // temperatura
  dTemp.begin();  // iniciando sensor de temperatura

  // balanca
  escala.begin(pintDT, pinSCK);  // iniciando balanca
  escala.tare(0);                //Zerando tara

  //relogio
  if (!rtc.begin()) {                        //Se o RTC nao for inicializado, faz
    Serial.println("RTC NAO INICIALIZADO");  //Imprime o texto
    while (1)
      ;  //Trava o programa
  }
  //rtc.adjust(DateTime(2025, 3, 28, 12, 40, 00)); //Ajusta o tempo do RTC para a data e hora definida pelo usuario.

  //tds metter / qualidade da agua
  pinMode(TdsSensorPin, INPUT);  // Configura o pino do sensor como entrada


  // influx
  WiFi.mode(WIFI_STA);                        // Setup wifi // configurando wifi
  wifiMulti.addAP(WIFI_SSID, WIFI_PASSWORD);  // conectando a rede

  Serial.print("Connecting to wifi");
  while (wifiMulti.run() != WL_CONNECTED) {  // esperando conexao
    Serial.print(".");
    delay(100);
  }
  Serial.println();

  // Accurate time is necessary for certificate validation and writing in batches // O tempo correto e necessario para certificar validacao e escrever os dados
  // We use the NTP servers in your area as provided by: https://www.pool.ntp.org/zone/ // nos usamos os NTP servers para ajustar de acordo com sua areak
  // Syncing progress and the time will be printed to Serial. // Sincronizando o prograsso e o tempo vai ser impresso no Serial
  timeSync(TZ_INFO, "pool.ntp.org", "time.nis.gov");

  // Check server connection // checa a conexao com o servidor
  if (client.validateConnection()) {
    Serial.print("Connected to InfluxDB: ");
    Serial.println(client.getServerUrl());
  } else {
    Serial.print("InfluxDB connection failed: ");
    Serial.println(client.getLastErrorMessage());
  }


  sPrato.attach(13);
  sRosca.attach(15);


  //delay antes inicio
  delay(1000);
}

char device[30] = "ESP8266-1";



void loop() {
  /*
  // imprimindo peso balanca e retornando-o
  pesar();

  // imprimindo data/hora
  relogio();

  // imprimindo temperatura e retornando-o
  temperatura();

  // imprimindo tdsMetter e retornando-o
  tdsMetter();
*/
  // enviando dados ao influx
  // ordem (temp, tds, peso, rtc)
  // influxSend(device ,temperatura(), tdsMetter(), pesar(), relogio());

  //  Serial.println("----------------------");

  //sPrato.write(180);
  // delay(1000);
  // sPrato.write(90);
  // delay(1000);
  // sPrato.write(180);
  // delay(1000);

  DateTime rtcDtHr = relogio();

  if ((rtcDtHr.hour() == 6 && rtcDtHr.minute() == 59)   || 
      (rtcDtHr.hour() == 11 && rtcDtHr.minute() == 59)  || 
      (rtcDtHr.hour() == 18 && rtcDtHr.minute() == 59)) {
    alimentar();
  }


  // delay anticrash
  delay(1000);
}
