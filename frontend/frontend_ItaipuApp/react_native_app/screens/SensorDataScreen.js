// screens/SensorDataScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";

export default function SensorDataScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSensorData = async () => {
    try {
      // Aqui pega os dados direto do ESP
      const response = await fetch("http://10.42.0.42/tds");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000); // atualiza a cada 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dados do Sensor</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00ffcc" />
      ) : data ? (
        <View style={styles.card}>
          <Text style={styles.label}>TDS (ppm):</Text>
          <Text style={styles.value}>{data.tds} ppm</Text>

          <Text style={styles.label}>Temperatura (°C):</Text>
          <Text style={styles.value}>{data.temperatura} °C</Text>
        </View>
      ) : (
        <Text style={styles.error}>Erro ao carregar dados do sensor</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00ffcc",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1e1e1e",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#aaa",
    marginTop: 10,
  },
  value: {
    fontSize: 22,
    color: "#fff",
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
