import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Avatar, Text, Button, Divider, Switch } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// CORREÇÃO DEFINITIVA - URL BASE
const API_BASE = "http://192.168.2.14:8000"; // SEM /api no final
const PROFILE_URL = `${API_BASE}/profile/`; // Corrigido para sua estrutura real

export default function ContaScreen() {
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [userData, setUserData] = useState({
    name: 'Carregando...',
    email: 'carregando...',
    phone: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Erro', 'Sessão expirada. Faça login novamente.');
          navigation.navigate('Login');
          return;
        }

        console.log('Fetching profile from:', PROFILE_URL);
        
        const response = await fetch(PROFILE_URL, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Status da resposta:', response.status);
        
        // Verifica se a resposta não é JSON válido (erro 404)
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('Resposta não é JSON:', text);
          throw new Error(`Resposta inválida do servidor: ${text}`);
        }
        
        if (!response.ok) {
          console.error('Erro detalhado:', data);
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        console.log('Dados recebidos:', data);
        
        setUserData({
          name: data.first_name || data.nome || 'Usuário',
          email: data.email || 'Sem email cadastrado',
          phone: data.phone || data.telefone || ''
        });
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        Alert.alert('Erro', error.message || 'Não foi possível carregar os dados do usuário');
      }
    };

    fetchUserData();
  }, [navigation]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Seção de Perfil */}
     <View style={styles.profileSection}>
      <Avatar.Icon 
        size={80} 
        icon="account" 
        style={{ backgroundColor: theme.primary }} 
      />
      <Text style={[styles.userName, { color: theme.textPrimary }]}>
        {userData.name}
      </Text>
      <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
        {userData.email}
      </Text>
      
  <Button 
    mode="outlined" 
    onPress={() => navigation.navigate('EditarConta')}
    style={styles.editButton}
    labelStyle={{ color: theme.primary }}
  >
    Editar Perfil
  </Button>
</View>
      <Divider style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Configurações da Conta */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Configurações da Conta</Text>
        
        <View style={styles.settingItem}>
          <Text style={[styles.settingText, { color: theme.textPrimary }]}>Notificações</Text>
          <Switch 
            value={notificationsEnabled} 
            onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
            color={theme.primary}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={[styles.settingText, { color: theme.textPrimary }]}>Tema Escuro</Text>
          <Switch 
            value={theme.dark} 
            onValueChange={toggleTheme}
            color={theme.primary}
          />
        </View>

        <Button 
          mode="text" 
          onPress={() => navigation.navigate('AlterarSenha')}
          style={styles.textButton}
          labelStyle={{ color: theme.primary }}
        >
          Alterar Senha
        </Button>
      </View>

      <Divider style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Configurações do Sistema */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Sistema</Text>
        
        <Button 
          mode="text" 
          onPress={() => navigation.navigate('Sobre')}
          style={styles.textButton}
          labelStyle={{ color: theme.textPrimary }}
        >
          Sobre o Aplicativo
        </Button>

        <Button 
          mode="text" 
          onPress={() => navigation.navigate('Termos')}
          style={styles.textButton}
          labelStyle={{ color: theme.textPrimary }}
        >
          Termos de Uso
        </Button>
      </View>

      <Divider style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Sessão de Logout */}
      <View style={styles.section}>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Login')}
          style={[styles.logoutButton, { backgroundColor: theme.danger }]}
          labelStyle={{ color: '#FFF' }}
        >
          Sair da Conta
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 15,
  },
  editButton: {
    marginTop: 10,
    borderColor: '#007C91',
  },
  divider: {
    marginVertical: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingText: {
    fontSize: 16,
  },
  textButton: {
    justifyContent: 'flex-start',
  },
  logoutButton: {
    marginTop: 10,
  },
});