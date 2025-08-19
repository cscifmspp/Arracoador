import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext'; // Substitua o import de Colors

export default function ControlesScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme(); // Adicione esta linha

  const controls = [
    {
      name: 'Alimentador',
      icon: 'food',
      description: 'Controle do alimentador automático',
      screen: 'Alimentador'
    },
    {
      name: 'Câmera',
      icon: 'camera',
      description: 'Visualização da câmera ao vivo',
      screen: 'Camera'
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Controles do Sistema</Text>
      
      {controls.map((control, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => navigation.navigate(control.screen)}
          style={[styles.card, { 
            backgroundColor: theme.surface,
            borderColor: theme.border
          }]}
          activeOpacity={0.7}
        >
          <View style={styles.cardContent}>
            <MaterialCommunityIcons 
              name={control.icon} 
              size={32} 
              color={theme.primary} 
              style={styles.icon}
            />
            <View style={styles.textContainer}>
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{control.name}</Text>
              <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>{control.description}</Text>
            </View>
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={24} 
              color={theme.textSecondary} 
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Mantenha apenas os estilos estruturais
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
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
  },
});