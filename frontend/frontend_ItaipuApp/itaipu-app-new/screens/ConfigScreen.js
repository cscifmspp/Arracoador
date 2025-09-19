import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { StaticColors } from '../constants/Colors';

export default function Configuracoes() {
  const { theme, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Minha Conta</Text>

      <View style={[styles.card, { 
        backgroundColor: theme.surface,borderColor: theme.border 
      }]}>
        <Text style={[styles.cardText, { color: theme.textPrimary }]}>
          Email: usuario@exemplo.com
        </Text>
        <Text style={[styles.cardText, { color: theme.textPrimary }]}>
          Status: Verificado
        </Text>
        <Text style={[styles.cardText, { color: theme.textPrimary }]}>
          ID de usuário: #12345
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        Preferências
      </Text>
      
      <View style={[styles.preferenceItem, { 
        backgroundColor: theme.surface,
        borderColor: theme.border
      }]}>
        <Text style={[styles.preferenceText, { color: theme.textPrimary }]}>
          Tema Escuro
        </Text>
        <Switch
          value={theme.dark}
          onValueChange={toggleTheme}
          thumbColor={theme.dark ? StaticColors.primary : '#f5f5f5'}
          trackColor={{
            false: theme.border,
            true: StaticColors.primary
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    marginTop: 60,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 30,
  },
  cardText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 15,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  preferenceText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
});