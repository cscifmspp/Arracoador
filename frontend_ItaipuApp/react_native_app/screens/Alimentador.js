import React from 'react';
import {StyleSheet,Dimensions,View,Text,TextInput,Button,SafeAreaView} from 'react-native';
import { DataTable, IconButton, FAB, Icon } from 'react-native-paper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

import Tabela from '../components/Tabela';
import Cabecalho from '../components/Cabecalho'

export default function Alimentador({alimentador,setAlimentador}) {
  const [horario,setHorario] = React.useState("");
  const [gramas,setGramas] = React.useState("");
  const [tipo,setTipo] = React.useState("");
  const adicionar = () => {
    setAlimentador([...alimentador,{horario,gramas,tipo}])
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Cabecalho txt="Gerenciar Arraçoamento" />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.txt}>Horario</Text>
          <Text style={styles.txt}>Gramas</Text>
          <Text>Tipo de Ração</Text>
        </View>
        <View style={styles.row}>
          <TextInput style={styles.inpTxt} mode="outlined" value={horario} onChangeText={novo=>{setHorario(novo)}} />
          <TextInput style={styles.inpTxt} mode="outlined" value={gramas} onChangeText={novo=>{setGramas(novo)}} />
          <TextInput style={styles.inpTxt} mode="outlined" value={tipo} onChangeText={novo=>{setTipo(novo)}}/>
            <Button color={'#2C2C2C'} title="Adicionar" style={styles.btn} onPress={()=>{adicionar()}}/>
        </View>

        <Tabela header={["Horario","Status","Gramas",""]} itens={alimentador} setAlimentador={setAlimentador}/>
        <Button color={'#2C2C2C'} title="Ver Relatório" mode="outlined" />
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inpTxt: {
    width: width * 0.2,
    height: 25,
    fontSize: 15,
    borderRadius: 0,
    backgroundColor: '#fff',
    marginHorizontal: 3,
    marginVertical: 10,
    borderTopLeftRadius: 5,
  },
  btn: {
    height: 25,
    marginVertical: 10,
    backgroundColor: '#2C2C2C',
    border: 0,
    color: '#ccc',
    borderRadius: 5,
  },
  btnR: {
    height: 25,
    marginVertical: 10,
    backgroundColor: '#2C2C2C',
    border: 0,
    color: '#ccc',
    borderRadius: 5,
    position: 'absolute',
    bottom: 20,
    right: 10,
  },
  txt: {
    marginRight: 30,
  },
});
