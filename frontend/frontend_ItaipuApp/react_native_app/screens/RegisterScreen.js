//RegisterScreen
import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Linking 
} from 'react-native';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import Config from '../config';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    phone: ''
  });
  const [mensagem, setMensagem] = useState('');

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const registrar = async () => {
    try {
        setMensagem('Criando conta...');
        
        const response = await axios.post(
            Config.getUrl('register'),
            { 
                email: formData.email.trim(),
                password: formData.password,
                first_name: formData.first_name,
                phone: formData.phone
            },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000,
            }
        );

        // SEMPRE mostra o link em desenvolvimento
        if (response.data.dev_link) {
            Alert.alert(
                'Conta criada com sucesso!',
                `Copie o link abaixo para ativar sua conta:\n\n${response.data.dev_link}`,
                [
                    { 
                        text: 'Copiar Link', 
                        onPress: () => Clipboard.setStringAsync(response.data.dev_link) 
                    },
                    { 
                        text: 'Abrir no Navegador', 
                        onPress: () => Linking.openURL(response.data.dev_link) 
                    },
                    { text: 'OK' }
                ]
            );
        } else {
            Alert.alert(
                'Sucesso',
                'Verifique seu e-mail para ativar sua conta'
            );
        }
        
        setMensagem(response.data.message);
        
    } catch (err) {
        let errorMessage = 'Erro ao cadastrar';
        
        if (err.response?.data?.error) {
            errorMessage = err.response.data.error;
        } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
        } else if (err.message.includes('timeout')) {
            errorMessage = 'Servidor não respondeu. Verifique sua conexão.';
        } else if (err.message.includes('Network Error')) {
            errorMessage = 'Erro de rede. Verifique se o servidor está rodando.';
        }
        
        setMensagem(errorMessage);
        console.error('Erro detalhado:', err.response?.data || err.message);
      }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      
      <TextInput
        placeholder="Nome Completo"
        value={formData.first_name}
        onChangeText={(text) => handleChange('first_name', text)}
        style={styles.input}
      />
      
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        placeholder="Senha"
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
        style={styles.input}
        secureTextEntry
      />
      
      <TextInput
        placeholder="Telefone"
        value={formData.phone}
        onChangeText={(text) => handleChange('phone', text)}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <Button title="Cadastrar" onPress={registrar} />
      
      <Text style={styles.message}>{mensagem}</Text>

      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Já tem uma conta? Entrar
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
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