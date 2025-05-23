
//Temperatura
#include <OneWire.h>
#include <DallasTemperature.h>
#define ONE_WIRE_BUS 2              // Data wire esta plugado na porta 2 do ESP
OneWire oneWire(ONE_WIRE_BUS);      // Instaciando a comunicacao wire
DallasTemperature dTemp(&oneWire);  // Passando a comunicacao wire para o Dallas Temperature


// funcao temperatura
float temperatura() {
  dTemp.requestTemperatures();
  delay(200);
  float tempC = dTemp.getTempCByIndex(0);

  if (tempC != DEVICE_DISCONNECTED_C) {  // verifica se o sensor esta conectado
    /*Serial.print("Temperatura: ");
    Serial.println(tempC);*/
    return tempC;
  } else {
    Serial.println("Error: Nao pode ler a temperatura");
  }
  return 0;
}
