import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const LeftContent = (props) => <Avatar.Icon {...props} style={{background:"#EADDFF"}} color="#4F378A" icon="check" />;

export default function Cabecalho(props) {
  return (
    <View style={styles.card}>
      <Text style={styles.txt}>
        {props.txt}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card:{
    marginHorizontal: "20px",
    marginTop: "20px",
    marginBottom: "5px",
    borderBottomColor:"#ccc",
    borderBottomWidth: "1px"
  },
  txt:{
    fontWeight: 800,
    fontSize: 15,
    fontFamily: "Arial",
    color: "#888"
  }
})