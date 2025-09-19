// VerificationScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Card } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config';

export default function VerificationScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { user_id, email } = route.params;
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto focus no próximo input
    if (text && index < 5) {
      inputsRef.current[index + 1].focus();
    }

    // Verifica automaticamente quando todos os campos estão preenchidos
    if (newCode.every(digit => digit !== '') && index === 5) {
      handleVerify();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      // Move o foco para o input anterior ao apagar
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      Alert.alert('Erro', 'Digite o código completo de 6 dígitos');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(Config.getUrl('verifyCode'), {
        user_id: user_id,
        code: verificationCode
      });

      if (response.data.status === 'success') {
        // Salva o token JWT
        await AsyncStorage.setItem('userToken', response.data.access);
        
        Alert.alert('Sucesso', 'Conta verificada com sucesso! Você já pode fazer login.', [
          {
            text: 'Fazer Login',
            onPress: () => {
              // Navega para a tela de Login
              navigation.navigate('Login');
            }
          }
        ]);
      }
    } catch (error) {
      console.error('Erro na verificação:', error);
      let errorMessage = 'Código inválido ou expirado';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Erro', errorMessage);
      
      // Limpa os campos em caso de erro
      setCode(['', '', '', '', '', '']);
      if (inputsRef.current[0]) {
        inputsRef.current[0].focus();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    try {
      const response = await axios.post(Config.getUrl('resendCode'), {
        user_id: user_id,
        email: email
      });

      if (response.data.status === 'success') {
        setCountdown(60);
        Alert.alert('Sucesso', 'Novo código enviado para seu email');
      } else {
        Alert.alert('Erro', response.data.message || 'Não foi possível reenviar o código');
      }
    } catch (error) {
      console.error('Erro ao reenviar código:', error);
      Alert.alert('Erro', 'Não foi possível reenviar o código. Verifique sua conexão.');
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Card style={[styles.card, { backgroundColor: theme.surface }]}>
        <Card.Content>
          <Text style={[styles.title, { color: theme.textPrimary, fontFamily: 'Inter_700Bold' }]}>
            Verificação de Email
          </Text>
          
          <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
            Enviamos um código de 6 dígitos para:
          </Text>
          
          <Text style={[styles.emailText, { color: theme.primary, fontFamily: 'Inter_700Bold' }]}>
            {email}
          </Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputsRef.current[index] = ref)}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(event) => handleKeyPress(event, index)}
                style={[
                  styles.codeInput,
                  { 
                    backgroundColor: theme.surface,
                    borderColor: digit ? theme.primary : theme.border,
                    color: theme.textPrimary
                  }
                ]}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                mode="outlined"
                selectTextOnFocus
                disabled={loading}
              />
            ))}
          </View>

          {loading ? (
            <ActivityIndicator color={theme.primary} style={styles.loader} />
          ) : (
            <Button
              mode="contained"
              onPress={handleVerify}
              style={[styles.button, { backgroundColor: theme.primary }]}
              disabled={code.some(digit => digit === '') || loading}
              labelStyle={{ fontFamily: 'Inter_700Bold' }}
            >
              Verificar Código
            </Button>
          )}

          <Button
            mode="text"
            onPress={handleResendCode}
            disabled={resending || countdown > 0 || loading}
            textColor={theme.primary}
            style={styles.resendButton}
            labelStyle={{ fontFamily: 'Inter_400Regular' }}
          >
            {resending ? 'Enviando...' : 
             countdown > 0 ? `Reenviar em ${countdown}s` : 'Reenviar código'}
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            disabled={loading}
            textColor={theme.textSecondary}
            style={styles.backButton}
            labelStyle={{ fontFamily: 'Inter_400Regular' }}
          >
            Voltar para o cadastro
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  codeInput: {
    width: 45,
    height: 60,
    fontSize: 20,
  },
  button: {
    borderRadius: 8,
    marginBottom: 15,
  },
  loader: {
    marginVertical: 20,
  },
  resendButton: {
    marginBottom: 10,
  },
  backButton: {
    marginTop: 10,
  },
});