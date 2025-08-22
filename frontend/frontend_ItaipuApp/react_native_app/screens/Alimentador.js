import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { Text, Card, Button, DataTable, Avatar, TouchableRipple } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Alimentador() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [alimentador, setAlimentador] = useState([]);
  const [horario, setHorario] = useState("");
  const [gramas, setGramas] = useState("");
  const [tipo, setTipo] = useState("");

  const adicionar = () => {
    if (horario && gramas && tipo) {
      const novoItem = {
        horario,
        gramas,
        tipo,
        status: "Pendente",
        id: Date.now().toString()
      };
      setAlimentador([...alimentador, novoItem]);
      setHorario("");
      setGramas("");
      setTipo("");
      Alert.alert("Sucesso", "Alimentação programada com sucesso!");
    } else {
      Alert.alert("Atenção", "Preencha todos os campos");
    }
  };

  const removerItem = (id) => {
    setAlimentador(alimentador.filter(item => item.id !== id));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableRipple onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={theme.textPrimary} />
      </TouchableRipple>

      <Text style={[styles.title, { color: theme.textPrimary }]}>Gerenciar Alimentação</Text>

      <Card style={[styles.card, { backgroundColor: theme.surface }]}>
        <Card.Title
          title="Nova Programação"
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
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.background, 
                color: theme.textPrimary,
                borderColor: theme.border 
              }]}
              placeholder="HH:MM"
              placeholderTextColor={theme.textSecondary}
              value={horario}
              onChangeText={setHorario}
            />
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.background, 
                color: theme.textPrimary,
                borderColor: theme.border 
              }]}
              placeholder="Gramas"
              placeholderTextColor={theme.textSecondary}
              value={gramas}
              onChangeText={setGramas}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.background, 
                color: theme.textPrimary,
                borderColor: theme.border 
              }]}
              placeholder="Tipo de ração"
              placeholderTextColor={theme.textSecondary}
              value={tipo}
              onChangeText={setTipo}
            />
          </View>
          <Button
            mode="contained"
            onPress={adicionar}
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            disabled={!horario || !gramas || !tipo}
          >
            Adicionar
          </Button>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.surface }]}>
        <Card.Title
          title="Programações Ativas"
          titleStyle={{ color: theme.textPrimary }}
          left={(props) => (
            <Avatar.Icon 
              {...props} 
              icon="clock" 
              style={{ backgroundColor: theme.primary }} 
            />
          )}
        />
        <Card.Content>
          {alimentador.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Nenhuma programação cadastrada
            </Text>
          ) : (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title textStyle={{ color: theme.textPrimary }}>Horário</DataTable.Title>
                <DataTable.Title textStyle={{ color: theme.textPrimary }}>Gramas</DataTable.Title>
                <DataTable.Title textStyle={{ color: theme.textPrimary }}>Tipo</DataTable.Title>
                <DataTable.Title textStyle={{ color: theme.textPrimary }}>Ação</DataTable.Title>
              </DataTable.Header>

              {alimentador.map((item) => (
                <DataTable.Row key={item.id}>
                  <DataTable.Cell textStyle={{ color: theme.textPrimary }}>{item.horario}</DataTable.Cell>
                  <DataTable.Cell textStyle={{ color: theme.textPrimary }}>{item.gramas}g</DataTable.Cell>
                  <DataTable.Cell textStyle={{ color: theme.textPrimary }}>{item.tipo}</DataTable.Cell>
                  <DataTable.Cell>
                    <Button
                      mode="text"
                      onPress={() => removerItem(item.id)}
                      textColor={theme.error}
                    >
                      Remover
                    </Button>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          )}
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        onPress={() => console.log("Relatório")}
        style={[styles.reportButton, { borderColor: theme.primary }]}
        textColor={theme.primary}
        icon="chart-bar"
      >
        Ver Relatório
      </Button>
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
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  addButton: {
    borderRadius: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  reportButton: {
    borderRadius: 8,
    marginTop: 10,
  },
});