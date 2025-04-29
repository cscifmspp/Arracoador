import React from 'react';
import { View } from 'react-native';

import CardItem from '../components/Monitoramento/CardItem';
import Cabecalho from '../components/Cabecalho';

export default function Monitorar() {
  return (
    <View>
      <Cabecalho txt="Monitoramento dos Sensores"/>
      <CardItem title="Temperatura da Água" subtitle="30ºC"/>
      <CardItem title="Qualidade da Água" subtitle="60"/>
      <CardItem title="PH da Água" subtitle="7"/>
      <CardItem title="Quantidade de Amônia" subtitle="5mg"/>
    </View>
  );
}
