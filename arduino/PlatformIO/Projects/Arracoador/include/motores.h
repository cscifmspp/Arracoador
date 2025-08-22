#include <Servo.h>
Servo sPrato;
Servo sRosca;
int pos = 0; // variavel para posição do servo

void pesarRacao() {
  pos = 0;
  while (pesar() < 0.5) {  // 0.5 kg (500 gramas)
    sRosca.attach(8);
    pos += 1;           // Incremento no ângulo do servo (ajuste conforme necessário)
    sRosca.write(pos);  // Define o ângulo do servo
    delay(10);          // Pequena pausa para movimento
  }
  delay(100);
  sRosca.detach();
  delay(100);
}

void despejarRacao() {
  for (pos = 180; pos >= 90; pos -= 1) {  //desejando ração - girando de 180º até 90º
    sPrato.write(pos);
    delay(5);
    Serial.println("Despejando");
  }
  delay(1000);
  for (pos = 90; pos <= 180; pos += 1) {  //recolhendo prato para proxima alimentação - girando de 90º até 180º
    sPrato.write(pos);
    delay(5);
    Serial.println("Voltando");
  }
  delay(500);
}

void alimentar() {  // função para pesar quantidade exata de ração (300g)
  pesarRacao();
  delay(500);
  despejarRacao();
  delay(500);
}