import React from 'react';
import { View, ScrollView, StyleSheet,SafeAreaView } from 'react-native';
import { RadioButton } from 'react-native-paper';

import Cabecalho from '../components/Cabecalho';
import Add from '../components/Tanque/Add';
import TanqueItem from '../components/Tanque/TanqueItem';

const estilo = StyleSheet.create({
  grupo:{
    marginLeft:20
  },
  aaa: {
    flex:1
  }
})

export default function Tanque({tanques,setTanques,tanqueIdx,setTanqueIdx}) {
  return (
    <SafeAreaView style={estilo.aaa}>
      <Cabecalho txt="Gerenciamento Tanques"/>
      <Add tanques={tanques} setTanques={setTanques}/>
      <ScrollView style={estilo.grupo}>
        <RadioButton.Group onValueChange={novo=>setTanqueIdx(novo)} value={tanqueIdx}>
          {tanques.map((tanque,idx)=>
            <TanqueItem key={idx} title={tanque.nome} status={"xd"} esteIdx={idx} tanqueIdx={tanqueIdx} setTanqueIdx={setTanqueIdx} tanques={tanques} setTanques={setTanques}/>
          )}
        </RadioButton.Group>
      </ScrollView>
    </SafeAreaView>
  );
}