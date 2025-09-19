import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, Alert, Image } from "react-native";
import { Card, Text, Button, Avatar, ActivityIndicator } from "react-native-paper";
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config'; 

const ESP_IP = "192.168.137.94";
const BASE_URL = `http://${ESP_IP}`;

export default function DashboardScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  const [sensorData, setSensorData] = useState({
    peso: 0,
    tds: 0,
    temperatura: 0,
    loading: true,
    error: null
  });
  
  const [motorStatus, setMotorStatus] = useState('Parado');
  const [userProfile, setUserProfile] = useState({
    foto: null,
    nome: 'Usuário'
  });
  const intervalRef = useRef(null);

  // Carregar perfil do usuário do AsyncStorage
  const loadUserProfile = async () => {
    try {
      const userData = await AsyncStorage.getItem('userProfile'); 
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUserProfile({
          foto: parsedData.foto || null,
          nome: parsedData.nome || 'Usuário'
        });
      } else {
        const defaultProfile = {
          nome: 'Usuário',
          email: '',
          telefone: '',
          foto: null
        };
        await AsyncStorage.setItem('userProfile', JSON.stringify(defaultProfile));
        setUserProfile({
          foto: null,
          nome: 'Usuário'
        });
      }
    } catch (error) {
      console.log('❌ Erro ao carregar perfil:', error);
    }
  };

  const fetchWithTimeout = async (url, ms = 5000) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ms);
    
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  };

  const fetchAllSensors = async () => {
    try {
      setSensorData(prev => ({ ...prev, loading: true, error: null }));
      
      const [pesoRes, tdsRes, tempRes, motorRes] = await Promise.all([
        fetchWithTimeout(`${BASE_URL}/peso`),
        fetchWithTimeout(`${BASE_URL}/tds`),
        fetchWithTimeout(`${BASE_URL}/temperatura`),
        fetchWithTimeout(`${BASE_URL}/motor/status`)
      ]);

      setSensorData({
        peso: parseFloat(pesoRes.peso) || 0,
        tds: parseFloat(tdsRes.tds) || 0,
        temperatura: parseFloat(tempRes.temperatura) || 0,
        loading: false,
        error: null
      });

      setMotorStatus(motorRes.status || 'Desconhecido');
    } catch (error) {
      setSensorData(prev => ({
        ...prev,
        loading: false,
        error: "Não foi possível conectar ao ESP8266. Verifique a conexão WiFi."
      }));
    }
  };

  const controlMotor = async (action) => {
    try {
      setMotorStatus(action === 'ligar' ? 'Ligando...' : 'Desligando...');
      
      const response = await fetchWithTimeout(`${BASE_URL}/motor/${action}`);
      setMotorStatus(action === 'ligar' ? 'Ligado' : 'Parado');
      Alert.alert('Sucesso', response.message || `Motor ${action === 'ligar' ? 'ligado' : 'desligado'} com sucesso!`);
    } catch (error) {
      setMotorStatus('Erro');
      Alert.alert('Erro', 'Não foi possível controlar o motor');
    }
  };

  useEffect(() => {
    loadUserProfile();
    fetchAllSensors();
    intervalRef.current = setInterval(fetchAllSensors, 5000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Atualizar perfil quando a tela receber foco
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserProfile();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* Header fixo */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Conta')}
          style={styles.profileButton}
        >
          {userProfile.foto ? (
            <Image 
              source={{ uri: userProfile.foto }} 
              style={[styles.profileImage, { borderColor: theme.primary }]}
              onError={() => setUserProfile(prev => ({ ...prev, foto: null }))}
            />
          ) : (
            <Avatar.Icon
              icon="account"
              size={48}
              style={[styles.avatarIcon, { backgroundColor: theme.primary }]}
            />
          )}
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Bem-vindo, {userProfile.nome}!
        </Text>
      </View>

      {/* Conteúdo Scrollável */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status da Conexão */}
        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          <Card.Title
            title="Status da Conexão"
            subtitle={sensorData.error ? "Desconectado" : `Conectado: ${ESP_IP}`}
            titleStyle={{ color: theme.textPrimary }}
            subtitleStyle={{ color: sensorData.error ? theme.error : theme.textSecondary }}
            left={(props) => (
              <Avatar.Icon 
                {...props} 
                icon={sensorData.error ? "wifi-off" : "wifi"} 
                style={{ backgroundColor: sensorData.error ? theme.error : theme.success }} 
              />
            )}
          />
        </Card>

        {/* Controle do Motor */}
        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          <Card.Title
            title="Controle do Motor"
            subtitle={`Status: ${motorStatus}`}
            titleStyle={{ color: theme.textPrimary }}
            subtitleStyle={{ color: theme.textSecondary }}
            left={(props) => (
              <Avatar.Icon 
                {...props} 
                icon="engine" 
                style={{ backgroundColor: theme.primary }} 
              />
            )}
          />
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={() => controlMotor('ligar')}
              style={{ marginRight: 10 }}
              disabled={motorStatus === 'Ligando...' || motorStatus === 'Ligado'}
            >
              Ligar
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => controlMotor('desligar')}
              disabled={motorStatus === 'Desligando...' || motorStatus === 'Parado'}
            >
              Desligar
            </Button>
          </Card.Actions>
        </Card>

        {/* Dados dos Sensores */}
        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          <Card.Title
            title="Dados dos Sensores"
            subtitle="Tempo real"
            titleStyle={{ color: theme.textPrimary }}
            subtitleStyle={{ color: theme.textSecondary }}
            left={(props) => (
              <Avatar.Icon 
                {...props} 
                icon="chart-line" 
                style={{ backgroundColor: theme.info }} 
              />
            )}
            right={(props) => (
              sensorData.loading ? 
                <ActivityIndicator {...props} color={theme.primary} /> : 
                <Button {...props} icon="refresh" onPress={fetchAllSensors} />
            )}
          />
          
          <Card.Content>
            {sensorData.error ? (
              <View style={styles.errorContainer}>
                <Text style={{ color: theme.error, marginBottom: 10 }}>
                  ⚠️ {sensorData.error}
                </Text>
                <Button 
                  mode="contained" 
                  onPress={fetchAllSensors}
                  style={{ backgroundColor: theme.error }}
                >
                  Tentar Novamente
                </Button>
              </View>
            ) : (
              <View style={styles.sensorsContainer}>
                <View style={styles.sensorRow}>
                  <Text style={[styles.sensorLabel, { color: theme.textPrimary }]}>Peso:</Text>
                  <Text style={[styles.sensorValue, { color: theme.primary }]}>
                    {sensorData.peso.toFixed(3)} kg
                  </Text>
                </View>
                
                <View style={styles.sensorRow}>
                  <Text style={[styles.sensorLabel, { color: theme.textPrimary }]}>TDS:</Text>
                  <Text style={[styles.sensorValue, { 
                    color: sensorData.tds > 1000 ? theme.error : theme.success 
                  }]}>
                    {sensorData.tds.toFixed(2)} ppm
                  </Text>
                </View>
                
                <View style={styles.sensorRow}>
                  <Text style={[styles.sensorLabel, { color: theme.textPrimary }]}>Temperatura:</Text>
                  <Text style={[styles.sensorValue, { 
                    color: sensorData.temperatura > 30 ? theme.error : theme.info 
                  }]}>
                    {sensorData.temperatura.toFixed(1)} °C
                  </Text>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Tanque')}
          style={[styles.button, { backgroundColor: theme.primary }]}
          labelStyle={{ color: theme.textPrimary }}
        >
          Ver Tanques
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80, // espaço para não sobrepor a tab bar
  },
  profileButton: {
    marginBottom: 10,
    marginTop: 50,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
  },
  avatarIcon: {
    backgroundColor: '#6200ee',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginTop: 20,
    textAlign: 'left',
    marginLeft: 15    
  },
  card: {
    marginBottom: 20,
    borderRadius: 16,
  },
  sensorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8
  },
  sensorLabel: {
    fontSize: 16,
    fontWeight: '500'
  },
  sensorValue: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  errorContainer: {
    alignItems: 'center',
    padding: 10
  },
  sensorsContainer: {
    padding: 5
  },
  button: {
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 12,
    padding: 8
  }
});
