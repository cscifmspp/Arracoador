import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator,Card} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen({ navigation, onLogin }) {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      setMensagem('Autenticando...');
      
      const response = await axios.post(
        Config.getUrl('login'), 
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      );

      if (!response.data.access) {
        throw new Error('Token não recebido do servidor');
      }

      await AsyncStorage.setItem('userToken', response.data.access);
      setMensagem('Login realizado com sucesso!');
      onLogin();
      
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
      await AsyncStorage.removeItem('userToken');
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
          Entrar
        </Text>

        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          <Card.Content>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
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
              value={password}
              onChangeText={setPassword}
              style={[styles.input, { backgroundColor: theme.surface }]}
              mode="outlined"
              secureTextEntry
              outlineColor={theme.border}
              activeOutlineColor={theme.primary}
              textColor={theme.textPrimary}
            />

            {loading ? (
              <ActivityIndicator animating={true} color={theme.primary} style={styles.loader} />
            ) : (
              <Button 
                mode="contained" 
                onPress={login}
                style={[styles.button, { backgroundColor: theme.primary }]}
                labelStyle={{ color: 'white', fontFamily: 'Inter_700Bold' }}
              >
                Entrar
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
          onPress={() => navigation.navigate('Register')}
          textColor={theme.primary}
          style={styles.linkButton}
          labelStyle={{ fontFamily: 'Inter_400Regular' }}
        >
          Não tem uma conta? Cadastre-se
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
    fontSize: 30,
    marginTop: 150,
    marginBottom: 10,
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