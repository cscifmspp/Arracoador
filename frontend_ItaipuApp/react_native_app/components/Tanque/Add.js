import React from "react"
import { View, Text, TextInput, StyleSheet,Button } from 'react-native';

export default function Add({tanques,setTanques}) {

  const [nome, setNome]= React.useState();
  const [ip, setIp]= React.useState();

  const adicionar = ()=>{
    setTanques([...tanques,{
      nome,
      ip
    }])
  }

  return (
    <View style={styles.add}>
      <View style={styles.margem}>
        <View style={styles.line}>
          <Text style={styles.txtAdd}>Nome:</Text>
          <TextInput style={styles.inpTxt} value={nome} onChangeText={setNome} />
        </View>
        <View style={styles.line}>
          <Text style={styles.txtAdd}>IP: </Text>
          <TextInput style={styles.inpTxt} value={ip} onChangeText={setIp}/>
        </View>

      </View>
      <Button style={styles.btnAdd} color="#2c2c2c" title="Adicionar" onPress={()=>adicionar()}/> 
    </View>
  );
}


const styles =  StyleSheet.create({
  margem: {
    marginBottom:10
  },
  line:{
    display: 'flex',
    flexDirection: "row",
    paddingBottom:  10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1

  },
  btnAdd:{
    height: 30,
    marginTop: 20,
    backgroundColor: '#2C2C2C',
    border: 0,
    color: '#ccc',
    borderRadius: 5,
  },
  txtAdd:{
    width:60,
    fontWeight: 700,

  },
  inpTxt:{
    outline: "none",
    width:"100%"
  },
  add:{
    margin: 20,
  }
})