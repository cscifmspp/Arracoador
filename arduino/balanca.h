//Balanca
#define pintDT 14
#define pinSCK 12
#include "HX711.h"
HX711 escala;                    // instanciando celula de carga
float fator_calibracao = 48100;  // this calibration factor is adjusted according to my load cell
float pesoKG;                    // criando variavel de retono peso em Kilos

//funcao balanca
double pesar() {
  escala.set_scale(fator_calibracao);  //Ajusta o fator de calibracao
  pesoKG = escala.get_units();         //Lendo peso
  if (pesoKG < 0) {                    // confere se peso e negativo e zera
    pesoKG = 0.000;
  }


  if (Serial.available()) {  // ajustes no fator calibracao
    char temp = Serial.read();
    if (temp == '+' || temp == 'a')
      fator_calibracao += 100;
    else if (temp == '-' || temp == 'z')
      fator_calibracao -= 100;
  }

 // Serial.println(pesoKG);  // imprime o peso
 // delay(100);              // delay de  processamento
  return pesoKG;           // retorna peso
}