import React from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { DataTable, IconButton } from 'react-native-paper';

const width = Dimensions.get('window').width;

export default function Tabela({ header = [], itens = [], setAlimentador = () => {} }) {
  const apagar = (index) => {
    const novosItens = [...itens];
    novosItens.splice(index, 1);
    setAlimentador(novosItens);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <DataTable style={styles.tabela}>
        <DataTable.Header>
          {header.map((titulo, index) => (
            <DataTable.Cell key={`header-${index}`} style={styles.headerCell}>
              {titulo}
            </DataTable.Cell>
          ))}
        </DataTable.Header>

        {itens.map((item, index) => (
          <DataTable.Row key={`row-${index}`}>
            <DataTable.Cell style={styles.cell}>{item.horario}</DataTable.Cell>
            <DataTable.Cell style={styles.cell}>{item.status || 'Pendente'}</DataTable.Cell>
            <DataTable.Cell style={styles.cell}>{item.gramas}</DataTable.Cell>
            <DataTable.Cell style={styles.cell}>
              <IconButton 
                icon="trash-can" 
                iconColor="#FF3B30"
                size={20}
                onPress={() => apagar(index)} 
              />
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  tabela: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    elevation: 2,
  },
  headerCell: {
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  cell: {
    justifyContent: 'center',
  },
});