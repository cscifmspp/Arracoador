import React from "react";
import {View, StyleSheet,Button} from "react-native";
import {List, RadioButton} from "react-native-paper";

export default function TanqueItem({title,status,esteIdx,tanques,setTanques}) {

  const remover = () => {
    const novo = structuredClone(tanques);
    novo.splice(esteIdx,1);
    setTanques(novo)
  }

  return <List.Item title={title} description={status}
    left={()=><RadioButton.Android value={esteIdx}/>}
    right={()=><Button style={estilo.btn} color={'#2C2C2C'} title="Remover" onPress={()=>remover()}/> }
  />
}
      

const estilo = StyleSheet.create({btn: {
    height: 25,
    marginVertical: 10,
    backgroundColor: '#2C2C2C',
    border: 0,
    color: '#ccc',
    borderRadius: 5,
  }})