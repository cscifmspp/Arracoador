// LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config';
export default function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState('');

  const login = async () => {
  try {
    setMensagem('Autenticando...');
    
    const response = await axios.post(
      Config.getUrl('login'), 
      { email, password },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    // Verifique se o token existe antes de armazenar
    if (!response.data.access) {
      throw new Error('Token não recebido do servidor');
    }

    // Armazene o token
    await AsyncStorage.setItem('userToken', response.data.access);
    setMensagem('Login realizado com sucesso!');
    onLogin(); // Chama o callback de login bem-sucedido
    
  } catch (err) {
    console.log('Erro no login:', err.response?.data || err.message);
    
    let errorMessage = 'Erro ao fazer login';
    if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message.includes('timeout')) {
      errorMessage = 'Tempo de conexão esgotado. Verifique sua rede.';
    } else if (err.message === 'Token não recebido do servidor') {
      errorMessage = 'Problema na autenticação. Tente novamente.';
    }
    
    setMensagem(errorMessage);
    // Limpe qualquer token inválido que possa estar armazenado
    await AsyncStorage.removeItem('userToken');
    }
    
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Entrar" onPress={login} />
      <Text style={styles.message}>{mensagem}</Text>

      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        Não tem uma conta? Cadastre-se
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#121212'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  message: {
    marginTop: 10,
    color: '#fff',
    textAlign: 'center'
  },
  link: {
    marginTop: 20,
    color: '#00f',
    textAlign: 'center'
  }
});
