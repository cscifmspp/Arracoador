#include <Wire.h>
#include "RTClib.h"

RTC_DS3231 rtc;

char diasDaSemana[7][12] = { "Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado" };
char dataHora[100];

// função relogio
char* relogio() {
  DateTime agora = rtc.now();

  sprintf(dataHora, "Data: %02d/%02d/%04d / Dia da semana: %s / Horas: %02d:%02d:%02d",
          agora.day(),
          agora.month(),
          agora.year(),
          diasDaSemana[agora.dayOfTheWeek()],
          agora.hour(),
          agora.minute(),
          agora.second());

  //Serial.println(dataHora);

  return dataHora;
}
