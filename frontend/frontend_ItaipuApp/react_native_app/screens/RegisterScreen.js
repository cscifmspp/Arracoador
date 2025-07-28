// RegisterScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState('');

  const registrar = async () => {
  try {
    setMensagem('Criando conta...');
    
    const response = await axios.post(
      'http://192.168.2.14:8000/api/auth/register/',
      { 
        email: email.trim(),
        password: password 
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    if (response.data.dev_verification_link) {
      // Modo desenvolvimento - mostra o link no app
      setMensagem(
        `Conta criada! (Modo desenvolvimento)\n` +
        `Link de verificação: ${response.data.dev_verification_link}\n\n` +
        `Copie este link e abra no navegador para ativar sua conta.`
      );
    } else {
      setMensagem(
        'Conta criada com sucesso!\n' +
        'Verifique seu e-mail (incluindo a pasta de spam) para ativar sua conta.'
      );
    }
  } catch (err) {
    let errorMessage = 'Erro ao cadastrar';
    
    if (err.response) {
      if (err.response.data?.error === "Email já cadastrado") {
        errorMessage = 'Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.';
      } else if (err.response.data?.error) {
        errorMessage = err.response.data.error;
      }
    } else if (err.message.includes('timeout')) {
      errorMessage = 'Servidor demorou para responder. Verifique sua conexão.';
    }
    
    setMensagem(errorMessage);
    console.error('Erro detalhado:', err.response?.data || err.message);
  }
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
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
      <Button title="Cadastrar" onPress={registrar} />
      <Text style={styles.message}>{mensagem}</Text>

      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Já tem uma conta? Entrar
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
