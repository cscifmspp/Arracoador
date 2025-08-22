// tdsMetter.h
#pragma once
#include <Arduino.h>

// --- Ajuste conforme seu NodeMCU ---
#define TdsSensorPin A0
#define VREF 3.3                 // ADC do NodeMCU é escalado para ~3.3V
#define SAMPLE_COUNT 30          // amostras para mediana

static int sensorReadings[SAMPLE_COUNT];
static int currentIndex = 0;
static float averageVoltage = 0, tdsValue = 0;
static float waterTempC = 25.0f; // temperatura de compensação
static bool bufferReady = false;

// Inicializa buffer com a leitura atual (evita lixo na mediana)
void tdsInit() {
  int val = analogRead(TdsSensorPin);
  for (int i = 0; i < SAMPLE_COUNT; i++) sensorReadings[i] = val;
  currentIndex = 0;
  bufferReady = true;
}

void setWaterTemperature(float t) {
  if (!isnan(t) && t > -20 && t < 85) {
    waterTempC = t;
  }
}

static int getMedian(int array[], int length) {
  // cópia para não alterar o buffer
  int tempArray[SAMPLE_COUNT];
  for (int i = 0; i < length; i++) tempArray[i] = array[i];

  // bubble sort simples (SAMPLE_COUNT pequeno)
  for (int i = 0; i < length - 1; i++) {
    for (int j = 0; j < length - i - 1; j++) {
      if (tempArray[j] > tempArray[j + 1]) {
        int tmp = tempArray[j];
        tempArray[j] = tempArray[j + 1];
        tempArray[j + 1] = tmp;
      }
    }
  }
  // mediana
  if (length % 2 == 0) {
    return (tempArray[length/2] + tempArray[length/2 - 1]) / 2;
  } else {
    return tempArray[length/2];
  }
}

// Geração de amostra / cálculo (não bloqueante)
float tdsMetter() {
  static unsigned long lastSampleTime = 0;
  static unsigned long lastCalcTime = 0;

  unsigned long now = millis();

  // coleta amostra a cada ~40ms
  if (now - lastSampleTime >= 40) {
    lastSampleTime = now;
    int raw = analogRead(TdsSensorPin);
    sensorReadings[currentIndex] = raw;
    currentIndex = (currentIndex + 1) % SAMPLE_COUNT;
  }

  // recalcula TDS a cada ~800ms
  if (now - lastCalcTime >= 800 && bufferReady) {
    lastCalcTime = now;

    averageVoltage = getMedian(sensorReadings, SAMPLE_COUNT) * (VREF / 1024.0f);
    float compensationCoefficient = 1.0f + 0.02f * (waterTempC - 25.0f);
    float compensatedVoltage = averageVoltage / compensationCoefficient;

    // Fórmula clássica (DFRobot)
    float v = compensatedVoltage;
    tdsValue = (133.42f * v * v * v - 255.86f * v * v + 857.39f * v) * 0.5f;
    if (tdsValue < 0) tdsValue = 0;
  }

  // retorna o último valor conhecido (mesmo se a janela de 800ms ainda não passou)
  return tdsValue;
}
  