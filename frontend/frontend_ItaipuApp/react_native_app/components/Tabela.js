import React from 'react';
import { StyleSheet, Dimensions, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { DataTable, IconButton, FAB } from 'react-native-paper';
import 'core-js/actual/structured-clone';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


export default function Tabela({ header, itens, setAlimentador }) {
  const apagar = uwu => {
    const novo = structuredClone(itens);
    novo.splice(uwu, 1);
    setAlimentador(novo);
  };

  return (
    <ScrollView contentContainerStyle={{ flexDirection: 'column' }}>
      <DataTable style={styles.tabela}>
        <DataTable.Header>
          {header.map((e, index) => (
            <DataTable.Cell key={`header-${index}`}>{e}</DataTable.Cell>
          ))}
        </DataTable.Header>

        {itens.map((row, idx) => (
          <DataTable.Row key={`row-${idx}`} style={{ flex: 1 }}>
            <DataTable.Cell style={styles.celula}>{row.horario}</DataTable.Cell>
            <DataTable.Cell style={styles.celula}>{row.status}</DataTable.Cell>
            <DataTable.Cell style={styles.celula}>{row.gramas}</DataTable.Cell>
            <DataTable.Cell>
              <IconButton 
                iconColor="#1b1d20" 
                icon="trash-can" 
                onPress={() => apagar(idx)} 
              />
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabela: {
    margin: 10,
    maxWidth: width - 20,
    maxHeight: height - 20
  },
  celula: {
    textAlignHorizontal: 'right',
    fontWeight:"bold"
  }
});
