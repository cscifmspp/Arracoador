import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Avatar } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity onPress={() => navigation.navigate('Conta')}>
        <Avatar.Icon
          icon="account"
          size={48}
          style={[styles.avatar, { backgroundColor: theme.surface }]}
        />
      </TouchableOpacity>

      <Text style={[styles.title, { color: theme.textPrimary }]}>Bem-vindo ao AquaSense</Text>

      <Card style={[styles.card, { backgroundColor: theme.surface }]}>
        <Card.Title
          title="Tanque 1"
          subtitle="Temperatura: 26°C"
          titleStyle={{ color: theme.textPrimary }}
          subtitleStyle={{ color: theme.textSecondary }}
          left={(props) => (
            <Avatar.Icon 
              {...props} 
              icon="fishbowl" 
              style={{ backgroundColor: theme.primary }} 
            />
          )}
        />
        <Card.Content>
          <Text style={{ color: theme.textPrimary }}>Oxigênio: 7.1 mg/L</Text>
          <Text style={{ color: theme.textPrimary }}>pH: 6.8</Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Tanque')}
        style={[styles.button, { backgroundColor: theme.primary }]}
        labelStyle={{ 
          fontFamily: 'Inter_700Bold', 
          color: theme.textPrimary 
        }}
      >
        Ver tanques
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  avatar: {
    alignSelf: 'flex-start',
    marginTop: 50
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginTop: 50,
    textAlign: 'center'
  },
  card: {
    marginTop: 70,
    borderRadius: 16,
  },
  button: {
    marginTop: 20,
    borderRadius: 12,
  }
});