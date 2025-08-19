import React from 'react';
import { StyleSheet, Dimensions, View, Text, TextInput, Button, SafeAreaView } from 'react-native';
import { DataTable } from 'react-native-paper';
import Tabela from '../components/Tabela';
import Cabecalho from '../components/Cabecalho';

const width = Dimensions.get('window').width;

export default function Alimentador({ alimentador = [], setAlimentador = () => {} }) {
  const [horario, setHorario] = React.useState("");
  const [gramas, setGramas] = React.useState("");
  const [tipo, setTipo] = React.useState("");

  const adicionar = () => {
    if (horario && gramas && tipo) {
      const novoItem = {
        horario,
        gramas,
        tipo,
        status: "Pendente" // Adicionando status padrão
      };
      setAlimentador([...alimentador, novoItem]);
      setHorario("");
      setGramas("");
      setTipo("");
    }
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Cabecalho txt="Gerenciar Arraçoamento" />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.txt}>Horário</Text>
          <Text style={styles.txt}>Gramas</Text>
          <Text style={styles.txt}>Tipo de Ração</Text>
        </View>
        <View style={styles.row}>
          <TextInput 
            style={styles.inpTxt} 
            value={horario} 
            onChangeText={setHorario}
            placeholder="HH:MM"
          />
          <TextInput 
            style={styles.inpTxt} 
            value={gramas} 
            onChangeText={setGramas}
            keyboardType="numeric"
            placeholder="Gramas"
          />
          <TextInput 
            style={styles.inpTxt} 
            value={tipo} 
            onChangeText={setTipo}
            placeholder="Tipo"
          />
          <Button 
            color={'#2C2C2C'} 
            title="Adicionar" 
            onPress={adicionar}
            disabled={!horario || !gramas || !tipo}
          />
        </View>

        <Tabela 
          header={["Horário", "Status", "Gramas", "Ação"]} 
          itens={alimentador} 
          setAlimentador={setAlimentador}
        />
        
        <Button 
          color={'#2C2C2C'} 
          title="Ver Relatório" 
          onPress={() => console.log("Relatório")} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    margin: 10,
    backgroundColor: '#A4D6A6',
    borderRadius: 5,
    padding: 10,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inpTxt: {
    width: width * 0.2,
    height: 40,
    fontSize: 15,
    backgroundColor: '#fff',
    marginHorizontal: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  txt: {
    width: width * 0.2,
    marginHorizontal: 3,
    fontWeight: 'bold',
  },
});