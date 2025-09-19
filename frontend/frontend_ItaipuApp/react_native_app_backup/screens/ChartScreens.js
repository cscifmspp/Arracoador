import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import { useSensorData } from '../hooks/useSensorData';

export default function ChartsScreen() {
  const { theme } = useTheme();
  const { history } = useSensorData();

  if (history.loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: theme.surface,
    backgroundGradientFrom: theme.surface,
    backgroundGradientTo: theme.surface,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${theme.textPrimaryRGB}, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: theme.primary
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Gráficos dos Sensores</Text>

      <Card style={[styles.card, { backgroundColor: theme.surface }]}>
        <Card.Title title="Peso (kg)" titleStyle={{ color: theme.textPrimary }} />
        <Card.Content>
          <LineChart
            data={{
              labels: history.peso.slice(-10).map(item => item.time.getHours() + ':' + item.time.getMinutes()),
              datasets: [{ data: history.peso.slice(-10).map(item => item.value) }]
            }}
            width={300}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.surface }]}>
        <Card.Title title="TDS (ppm)" titleStyle={{ color: theme.textPrimary }} />
        <Card.Content>
          <LineChart
            data={{
              labels: history.tds.slice(-10).map(item => item.time.getHours() + ':' + item.time.getMinutes()),
              datasets: [{ data: history.tds.slice(-10).map(item => item.value) }]
            }}
            width={300}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.surface }]}>
        <Card.Title title="Temperatura (°C)" titleStyle={{ color: theme.textPrimary }} />
        <Card.Content>
          <LineChart
            data={{
              labels: history.temperatura.slice(-10).map(item => item.time.getHours() + ':' + item.time.getMinutes()),
              datasets: [{ data: history.temperatura.slice(-10).map(item => item.value) }]
            }}
            width={300}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginBottom: 30
  },
  card: {
    marginBottom: 20,
    borderRadius: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16
  }
});