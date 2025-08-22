import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Avatar, TextInput, RadioButton, TouchableRipple } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Tanque() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [tanques, setTanques] = useState([
    { id: '1', nome: 'Tanque Principal', capacidade: '1000L', especie: 'Tilápia', status: 'Ativo' },
    { id: '2', nome: 'Tanque de Alevinos', capacidade: '500L', especie: 'Alevinos', status: 'Ativo' },
  ]);
  const [tanqueSelecionado, setTanqueSelecionado] = useState('1');
  const [novoTanque, setNovoTanque] = useState({ nome: '', capacidade: '', especie: '' });

  const adicionarTanque = () => {
    if (novoTanque.nome && novoTanque.capacidade && novoTanque.especie) {
      const novo = {
        id: Date.now().toString(),
        nome: novoTanque.nome,
        capacidade: novoTanque.capacidade,
        especie: novoTanque.especie,
        status: 'Ativo'
      };
      setTanques([...tanques, novo]);
      setNovoTanque({ nome: '', capacidade: '', especie: '' });
      Alert.alert("Sucesso", "Tanque adicionado com sucesso!");
    } else {
      Alert.alert("Atenção", "Preencha todos os campos");
    }
  };

  const removerTanque = (id) => {
    setTanques(tanques.filter(tanque => tanque.id !== id));
    if (tanqueSelecionado === id) {
      setTanqueSelecionado(tanques[0]?.id || '');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableRipple onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={theme.textPrimary} />
      </TouchableRipple>

      <Text style={[styles.title, { color: theme.textPrimary }]}>Gerenciar Tanques</Text>

      <Card style={[styles.card, { backgroundColor: theme.surface }]}>
        <Card.Title
          title="Adicionar Novo Tanque"
          titleStyle={{ color: theme.textPrimary }}
          left={(props) => (
            <Avatar.Icon 
              {...props} 
              icon="plus" 
              style={{ backgroundColor: theme.primary }} 
            />
          )}
        />
        <Card.Content>
          <TextInput
            label="Nome do Tanque"
            value={novoTanque.nome}
            onChangeText={(text) => setNovoTanque({...novoTanque, nome: text})}
            style={[styles.input, { backgroundColor: theme.background }]}
            textColor={theme.textPrimary}
            mode="outlined"
          />
          <TextInput
            label="Capacidade"
            value={novoTanque.capacidade}
            onChangeText={(text) => setNovoTanque({...novoTanque, capacidade: text})}
            style={[styles.input, { backgroundColor: theme.background }]}
            textColor={theme.textPrimary}
            mode="outlined"
            keyboardType="numeric"
          />
          <TextInput
            label="Espécie"
            value={novoTanque.especie}
            onChangeText={(text) => setNovoTanque({...novoTanque, especie: text})}
            style={[styles.input, { backgroundColor: theme.background }]}
            textColor={theme.textPrimary}
            mode="outlined"
          />
          <Button
            mode="contained"
            onPress={adicionarTanque}
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            disabled={!novoTanque.nome || !novoTanque.capacidade || !novoTanque.especie}
          >
            Adicionar Tanque
          </Button>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.surface }]}>
        <Card.Title
          title="Tanques Cadastrados"
          titleStyle={{ color: theme.textPrimary }}
          left={(props) => (
            <Avatar.Icon 
              {...props} 
              icon="fishbowl" 
              style={{ backgroundColor: theme.primary }} 
            />
          )}
        />
        <Card.Content>
          <RadioButton.Group onValueChange={setTanqueSelecionado} value={tanqueSelecionado}>
            <ScrollView style={styles.tanquesList}>
              {tanques.map((tanque) => (
                <TouchableRipple
                  key={tanque.id}
                  onPress={() => setTanqueSelecionado(tanque.id)}
                  style={[
                    styles.tanqueItem,
                    { 
                      backgroundColor: tanqueSelecionado === tanque.id ? 
                        theme.primary + '20' : 'transparent',
                      borderColor: theme.border
                    }
                  ]}
                >
                  <View style={styles.tanqueContent}>
                    <View style={styles.tanqueInfo}>
                      <RadioButton value={tanque.id} color={theme.primary} />
                      <View style={styles.tanqueDetails}>
                        <Text style={[styles.tanqueNome, { color: theme.textPrimary }]}>
                          {tanque.nome}
                        </Text>
                        <Text style={[styles.tanqueDesc, { color: theme.textSecondary }]}>
                          {tanque.capacidade} - {tanque.especie}
                        </Text>
                      </View>
                    </View>
                    <Button
                      mode="text"
                      onPress={() => removerTanque(tanque.id)}
                      textColor={theme.error}
                      icon="delete"
                    >
                      Remover
                    </Button>
                  </View>
                </TouchableRipple>
              ))}
            </ScrollView>
          </RadioButton.Group>
        </Card.Content>
      </Card>

      {tanqueSelecionado && (
        <Button
          mode="outlined"
          onPress={() => Alert.alert("Detalhes", "Navegar para detalhes do tanque")}
          style={[styles.detailsButton, { borderColor: theme.primary }]}
          textColor={theme.primary}
          icon="information"
        >
          Ver Detalhes do Tanque Selecionado
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 50,
    padding: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    borderRadius: 8,
  },
  addButton: {
    borderRadius: 8,
    marginTop: 10,
  },
  tanquesList: {
    maxHeight: 300,
  },
  tanqueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  tanqueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  tanqueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tanqueDetails: {
    marginLeft: 12,
  },
  tanqueNome: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  tanqueDesc: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  detailsButton: {
    borderRadius: 8,
  },
});