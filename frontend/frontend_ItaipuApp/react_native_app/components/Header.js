import React from 'react';
import { Appbar } from 'react-native-paper';

export default function Header({conectado}) {
  return (
    <Appbar.Header style={{ backgroundColor: "#1d1b20" }}>
      <Appbar.Content
        title="Alimentador - CSC"
        titleStyle={{ textAlign: "center", color: conectado ? "green" : "red"}}
      />
    </Appbar.Header>
  );
}