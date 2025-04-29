import React from 'react';
import { View, ScrollView, StyleSheet,SafeAreaView, Image } from 'react-native';

import Cabecalho from '../components/Cabecalho';
import AlimentarManual from '../components/AlimentarManual';

const estilo = StyleSheet.create({
  aaa: {
    flex:1
  },
  center: {
    justifyContent:'center',
    alignItems:'center',
    marginTop:30
  },
  morte: {
    flex:1,
    justifyContent:"center"
  }
})

export default function Tanque() {
  return (
    <SafeAreaView style={estilo.aaa}>
      <Cabecalho txt="Câmera e Alimentação Manual"/>
      <View style={estilo.center}>
        <Image source={{uri:"https://preview.redd.it/what-is-your-opinion-on-zundamon-v0-g343a8wh42rd1.jpeg?auto=webp&s=de7b7c6c9981a92d887b34686adcb80533866adb"}} style={{
        width: 320,
        height: 200
        }}/>
        <AlimentarManual style={estilo.morte}/>
      </View>
    </SafeAreaView>
  );
}