// RegisterScreen.js
import React, { useState } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Card } from 'react-native-paper';
import axios from 'axios';
import Config from '../config';
import { useTheme } from '../context/ThemeContext';

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    phone: ''
  });
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const registrar = async () => {
    try {
      setLoading(true);
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

      if (response.data.status === 'success') {
        // Redireciona para a tela de verificação
        navigation.navigate('Verification', {
          user_id: response.data.user_id,
          email: formData.email.trim()
        });
      } else {
        setMensagem(response.data.message || 'Erro no registro');
      }
      
    } catch (error) {
      let errorMessage = 'Erro ao cadastrar';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Servidor não respondeu. Verifique sua conexão.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Erro de rede. Verifique se o servidor está rodando.';
      }
      
      setMensagem(errorMessage);
      console.error('Erro detalhado:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.textPrimary, fontFamily: 'Inter_700Bold' }]}>
          Criar Conta
        </Text>

        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          <Card.Content>
            <TextInput
              label="Nome Completo"
              value={formData.first_name}
              onChangeText={(text) => handleChange('first_name', text)}
              style={[styles.input, { backgroundColor: theme.surface }]}
              mode="outlined"
              outlineColor={theme.border}
              activeOutlineColor={theme.primary}
              textColor={theme.textPrimary}
            />
            
            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              style={[styles.input, { backgroundColor: theme.surface }]}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              outlineColor={theme.border}
              activeOutlineColor={theme.primary}
              textColor={theme.textPrimary}
            />
            
            <TextInput
              label="Senha"
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              style={[styles.input, { backgroundColor: theme.surface }]}
              mode="outlined"
              secureTextEntry
              outlineColor={theme.border}
              activeOutlineColor={theme.primary}
              textColor={theme.textPrimary}
            />
            
            <TextInput
              label="Telefone"
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              style={[styles.input, { backgroundColor: theme.surface }]}
              mode="outlined"
              keyboardType="phone-pad"
              outlineColor={theme.border}
              activeOutlineColor={theme.primary}
              textColor={theme.textPrimary}
            />

            {loading ? (
              <ActivityIndicator animating={true} color={theme.primary} style={styles.loader} />
            ) : (
              <Button 
                mode="contained" 
                onPress={registrar}
                style={[styles.button, { backgroundColor: theme.primary }]}
                labelStyle={{ color: 'white', fontFamily: 'Inter_700Bold' }}
              >
                Cadastrar
              </Button>
            )}

            {mensagem ? (
              <Text style={[styles.message, { color: theme.textSecondary }]}>
                {mensagem}
              </Text>
            ) : null}
          </Card.Content>
        </Card>

        <Button 
          mode="text" 
          onPress={() => navigation.navigate('Login')}
          textColor={theme.primary}
          style={styles.linkButton}
          labelStyle={{ fontFamily: 'Inter_400Regular' }}
        >
          Já tem uma conta? Entrar
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    marginTop: 50,
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    borderRadius: 8,
    marginTop: 10,
    paddingVertical: 5,
  },
  loader: {
    marginVertical: 20,
  },
  message: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 14,
  },
  linkButton: {
    marginTop: 20,
  },
});