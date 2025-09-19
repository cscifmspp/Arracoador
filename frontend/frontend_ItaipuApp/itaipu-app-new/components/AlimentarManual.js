import React from 'react'
import { View, StyleSheet, Text, TextInput, Button } from 'react-native'

const styles = StyleSheet.create({
  owo: {
    marginTop:20,
    flex:1,
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    maxWidth: 100
  },
  coringa: {
    marginLeft: 5,
    marginRight:5,
  },
  inpTxt: {
      borderRadius: 5,
      border: "1px solid silver",
      borderTopWidth: 2,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 0,
      borderRightColor: "rgba(0,0,0,0)",
      borderBottomColor: "rgba(0,0,0,0)"
  },
  inpTxt1:{
      padding:5,
      maxWidth:50,
      textAlign: "center",
      marginTop: 2
  },
  inpTxt2:{
      padding:5,
      paddingLeft: 10,
      maxWidth:100,
      marginTop: 2
  },
  button: {
    marginLeft: 5
  }
})

export default function AlimentarManual() {
  const [gramas,setGramas] = React.useState(0);
  const [racao,setRacao] = React.useState("2-3");
  return (
    <View style={styles.owo}>
      <View style={styles.coringa}>
        <Text>Gramas</Text>
        <TextInput style={[styles.inpTxt, styles.inpTxt1]} value={gramas} onChangeText={setGramas} />
      </View>
      <View style={styles.coringa}>
        <Text>Tipo de Ração</Text>
        <TextInput style={[styles.inpTxt, styles.inpTxt2]} value={racao} onChangeText={setRacao} />
      </View>
      <View style={styles.button}></View>
      <Button color="black" title="Alimentar" container={styles.button}/>
    </View>
  )
}