import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState('');

  const login = async () => {
    try {
      await axios.post('http://192.168.2.14:8000/api/auth/login/', {
        email,
        password
      });
      setMensagem('Login realizado com sucesso!');
      onLogin();  // chama o callback que troca de tela
    } catch (err) {
      setMensagem('Credenciais inválidas');
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
