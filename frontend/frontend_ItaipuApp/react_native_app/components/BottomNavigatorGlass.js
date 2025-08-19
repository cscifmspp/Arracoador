import React, { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DashboardScreen from '../screens/DashboardScreen';
import Alimentador from '../screens/Alimentador';
import Tanque from '../screens/Tanque';
import Camera from '../screens/Camera';
import Controles from '../screens/Controles';
import Configuracoes from '../screens/Configuracoes';
//import ComoUsar from '../screens/ComoUsar'; // se for uma tela separada

export default function BottomNavigatorGlass() {
  const [index, setIndex] = useState(0);

  const [tanques, setTanques] = useState([]);
  const [alimentador, setAlimentador] = useState([]);
  const [tanqueIdx, setTanqueIdx] = useState([]);

  const routes = [
    { key: 'dashboard', title: 'Dashboard', icon: 'view-dashboard-outline' },
    { key: 'controles', title: 'Controles', icon: 'toggle-switch-outline' },
    //{ key: 'tanque', title: 'Tanques', icon: 'fishbowl-outline' },
    //{ key: 'camera', title: 'Câmera', icon: 'camera-outline' },
    //{ key: 'comousar', title: 'Como Usar', icon: 'information-outline' },
    { key: 'configuracoes', title: 'Configurações', icon: 'account' },
  ];

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'controles':
        return <Controles />;
      /*case 'alimentador':
        return <Alimentador alimentador={alimentador} setAlimentador={setAlimentador} />;
      case 'tanque':
        return (
          <Tanque
            tanques={tanques}
            setTanques={setTanques}
            tanqueIdx={tanqueIdx}
            setTanqueIdx={setTanqueIdx}
          />
        );
      case 'camera':
        return <Camera />;
      case 'comousar':
        return <ComoUsar />;
      */
      case 'configuracoes':
        return <Configuracoes />;
    }
  };

  const renderIcon = ({ route, focused, color }) => (
    <MaterialCommunityIcons
      name={route.icon}
      size={24}
      color={color}
    />
  );

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      renderIcon={renderIcon}
      sceneAnimationEnabled={true}
    />
  );
}
