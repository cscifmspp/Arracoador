//tds metter / qualidade da agua
#define TdsSensorPin A0                                    // Pino do sensor TDS
#define VREF 5.0                                           // Voltagem de referência do ADC (em Volts)
#define SAMPLE_COUNT 30                                    // Número de amostras a serem coletadas
int sensorReadings[SAMPLE_COUNT];                          // Array para armazenar os valores analógicos lidos do sensor
int currentIndex = 0;                                      // Índice para armazenar a leitura atual
float averageVoltage = 0, tdsValue = 0, temperature = 25;  // criando variaveis para salvar dados

// Função para calcular o valor mediano de um array
int getMedian(int array[], int length) {
  int tempArray[length];
  // Copia os valores para não modificar o array original
  for (int i = 0; i < length; i++) {
    tempArray[i] = array[i];
  }
  // Ordena os valores do array
  for (int i = 0; i < length - 1; i++) {
    for (int j = 0; j < length - i - 1; j++) {
      if (tempArray[j] > tempArray[j + 1]) {
        int temp = tempArray[j];
        tempArray[j] = tempArray[j + 1];
        tempArray[j + 1] = temp;
      }
    }
  }
  // Retorna o valor mediano
  int median = (length % 2 == 0) ? (tempArray[length / 2] + tempArray[length / 2 - 1]) / 2 : tempArray[length / 2];
  return median;
}

// funcao tds metter / qualidade da agua
float tdsMetter() {
  static unsigned long lastSampleTime = millis();
  if (millis() - lastSampleTime > 40) {
    lastSampleTime = millis();
    sensorReadings[currentIndex] = analogRead(TdsSensorPin);
    currentIndex = (currentIndex + 1) % SAMPLE_COUNT;
  }
  static unsigned long lastPrintTime = millis();
  if (millis() - lastPrintTime > 800) {
    lastPrintTime = millis();
    averageVoltage = getMedian(sensorReadings, SAMPLE_COUNT) * VREF / 1024.0;
    float compensationCoefficient = 1.0 + 0.02 * (temperature - 25.0);
    float compensatedVoltage = averageVoltage / compensationCoefficient;
    tdsValue = (133.42 * compensatedVoltage * compensatedVoltage * compensatedVoltage - 255.86 * compensatedVoltage * compensatedVoltage + 857.39 * compensatedVoltage) * 0.5;
   /* Serial.print("TDS Value: ");
    Serial.print(tdsValue, 0);
    Serial.println(" ppm");*/
    return tdsValue;
  }
  return 0;
}
