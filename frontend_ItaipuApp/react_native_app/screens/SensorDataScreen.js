import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const SensorDataScreen = () => {
    const [sensorData, setSensorData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSensorData = async () => {
        try {
            const response = await axios.get('http://192.168.0.x:8000/api/sensor-data/'); // substitua pelo IP local do seu PC
            setSensorData(response.data.data);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSensorData();
    }, []);

    const prepareChartData = (fieldName) => {
        const filtered = sensorData
            .filter(item => item.field === fieldName)
            .slice(0, 10)
            .reverse(); // do mais antigo para o mais novo

        return {
            labels: filtered.map(item => new Date(item.time).toLocaleTimeString().slice(0, 5)), // ex: "14:30"
            datasets: [
                {
                    data: filtered.map(item => item.value),
                    strokeWidth: 2,
                },
            ],
        };
    };

    if (loading) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Temperatura (°C)</Text>
            <LineChart
                data={prepareChartData("temperatura")}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
            />

            <Text style={styles.title}>pH</Text>
            <LineChart
                data={prepareChartData("ph")}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
            />
        </ScrollView>
    );
};

const chartConfig = {
    backgroundGradientFrom: "#f0f0f0",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    propsForDots: {
        r: "4",
        strokeWidth: "2",
        stroke: "#007bff",
    },
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    chart: {
        marginVertical: 16,
        borderRadius: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
});

export default SensorDataScreen;
