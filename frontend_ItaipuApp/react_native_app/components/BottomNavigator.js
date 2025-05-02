import * as React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Animated, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Alimentador from "../screens/Alimentador";
import Monitorar from "../screens/Monitorar";
import Tanque from '../screens/Tanque';
import Camera from '../screens/Camera';

const ComoUsar = () => <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Como Usar</Text></View>;

export default function BottomNavigator() {
  const [index, setIndex] = React.useState(0);

  const [tanques, setTanques] = React.useState([
    { nome: "teste", ip: "0.0.0.0" },
    { nome: "teste", ip: "0.0.0.0" }
  ]);
  const [alimentador, setAlimentador] = React.useState([
    { horario: "07:00", status: "OK", gramas: 300 }
  ]);
  const [tanqueIdx, setTanqueIdx] = React.useState([]);

  // Animações de scale dos botões
  const scales = [0,1,2,3,4].map(() => React.useRef(new Animated.Value(1)).current);

  const handlePress = (idx) => {
    setIndex(idx);
    scales.forEach((scale, i) => {
      Animated.spring(scale, {
        toValue: i === idx ? 1.3 : 1,
        useNativeDriver: true,
      }).start();
    });
  };

  const screens = [
    { 
      icon: 'clipboard-text-search-outline', 
      screen: <Monitorar tanques={tanques} tanqueIdx={tanqueIdx} />, 
      label: 'Monitorar' 
    },
    { 
      icon: 'grain', 
      screen: <Alimentador alimentador={alimentador} setAlimentador={setAlimentador} />, 
      label: 'Alimentador' 
    },
    { 
      icon: 'fishbowl', 
      screen: <Tanque tanques={tanques} setTanques={setTanques} tanqueIdx={tanqueIdx} setTanqueIdx={setTanqueIdx} />, 
      label: 'Tanque' 
    },
    { 
      icon: 'camera-outline', 
      screen: <Camera />, 
      label: 'Camera',
      isCenter: true 
    },
    { 
      icon: 'information-outline', 
      screen: <ComoUsar />, 
      label: 'Como Usar' 
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {screens[index].screen}
      </View>

      <View style={styles.floatingNav}>
        {screens.map((item, idx) => (
          <TouchableWithoutFeedback key={idx} onPress={() => handlePress(idx)}>
            <Animated.View
              style={[
                styles.iconButton,
                item.isCenter && styles.centerIcon,
                { transform: [{ scale: scales[idx] }] }
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={item.isCenter ? 36 : 28}
                color={index === idx ? '#00FF00' : '#fff'}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingNav: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#2b2d30',
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    padding: 10,
    borderRadius: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
    borderRadius: 30,
  },
  centerIcon: {
    backgroundColor: '#1b1d20',
    padding: 15,
    borderRadius: 40,
    elevation: 10,
  },
});
