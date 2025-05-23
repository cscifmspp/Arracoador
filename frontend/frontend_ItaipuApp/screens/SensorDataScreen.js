import React, { useEffect, useState } from 'react';
import {
    View, Text, Dimensions, ScrollView, StyleSheet,
    ActivityIndicator, ImageBackground, TouchableOpacity, FlatList
} from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const SensorDataScreen = () => {
    const [sensorData, setSensorData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('chart'); // 'chart' ou 'list'

    const fetchSensorData = async () => {
        try {
            const response = await axios.get('http://192.168.137.1:8000/api/sensor-data/');
            const data = response.data?.data;
            setSensorData(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            setSensorData([]);
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
            .slice(-10)
            .reverse();

        const values = filtered.map(item => parseFloat(item.value) || 0);

        const labels = filtered.map((item, index) => {
            if (index % 2 === 0) {
                const time = new Date(item.time);
                return `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}`;
            }
            return '';
        });

        return {
            labels,
            datasets: [{ data: values, strokeWidth: 2 }]
        };
    };

    const renderDataItem = ({ item }) => {
        const time = new Date(item.time);
        return (
            <View style={styles.listItem}>
                <Text style={styles.listField}>{item.field}</Text>
                <Text style={styles.listValue}>{item.value}</Text>
                <Text style={styles.listTime}>
                    {time.getHours()}:{String(time.getMinutes()).padStart(2, '0')}
                </Text>
            </View>
        );
    };

    if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

    return (
        <ImageBackground
            source={require('../assets/bg.jpg')}
            style={styles.background}
            blurRadius={4}
        >
            <View style={styles.header}>
                <Text style={styles.screenTitle}>Leitura dos Sensores</Text>
                <TouchableOpacity onPress={() => setViewMode(viewMode === 'chart' ? 'list' : 'chart')}>
                    <Ionicons
                        name={viewMode === 'chart' ? 'list-outline' : 'bar-chart-outline'}
                        size={28}
                        color="white"
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {viewMode === 'chart' ? (
                    <>
                        <BlurView intensity={60} tint="dark" style={styles.glassCard}>
                            <Text style={styles.title}>Temperatura (°C)</Text>
                            <LineChart
                                data={prepareChartData("temperatura")}
                                width={screenWidth - 64}
                                height={200}
                                chartConfig={chartConfig}
                                bezier
                                style={styles.chart}
                                formatXLabel={label => label.length > 0 ? label : ' '}
                            />
                        </BlurView>

                        <BlurView intensity={60} tint="dark" style={styles.glassCard}>
                            <Text style={styles.title}>TDS (ppm)</Text>
                            <LineChart
                                data={prepareChartData("tdsMetter")}
                                width={screenWidth - 64}
                                height={200}
                                chartConfig={chartConfig}
                                bezier
                                style={styles.chart}
                                formatXLabel={label => label.length > 0 ? label : ' '}
                            />
                        </BlurView>
                    </>
                ) : (
                    <BlurView intensity={60} tint="dark" style={[styles.glassCard, { width: screenWidth - 32 }]}>
                        <Text style={styles.title}>Lista de Dados</Text>
                        <FlatList
                            data={sensorData.slice(-20).reverse()}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderDataItem}
                        />
                    </BlurView>
                )}
            </ScrollView>
        </ImageBackground>
    );
};

const chartConfig = {
    backgroundGradientFrom: "transparent",
    backgroundGradientTo: "transparent",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    propsForDots: {
        r: "4",
        strokeWidth: "2",
        stroke: "#ffffff",
    },
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        padding: 16,
        alignItems: 'center',
        paddingBottom: 32,
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        padding: 16,
        marginBottom: 24,
        width: screenWidth - 32,
        overflow: 'hidden',
    },
    chart: {
        marginTop: 8,
        borderRadius: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    screenTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    header: {
        marginTop: 64,
        marginBottom: 8,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        borderBottomWidth: 1,
    },
    listField: {
        color: '#fff',
        fontWeight: '500',
        flex: 1,
    },
    listValue: {
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    listTime: {
        color: '#aaa',
        flex: 1,
        textAlign: 'right',
    },
    tabBarStyle: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        elevation: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        height: 70,
        paddingBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
    }
});

export default SensorDataScreen;
