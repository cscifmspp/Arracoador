import React, { useState } from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import SensorDataScreen from '../screens/SensorDataScreen';
import Alimentador from '../screens/Alimentador';
import Tanque from '../screens/Tanque';
import Camera from '../screens/Camera';

const ComoUsar = () => <Text style={{ padding: 20 }}>Como Usar</Text>;
const Conta = () => <Text style={{ padding: 20 }}>Minha Conta</Text>;



export default function BottomNavigatorGlass() {
    const [index, setIndex] = useState(0);

    const [tanques, setTanques] = useState([]);
    const [alimentador, setAlimentador] = useState([]);
    const [tanqueIdx, setTanqueIdx] = useState([]);

    const routes = [
        { key: 'sensor', title: 'Sensores', icon: 'chart-line' },
        { key: 'alimentador', title: 'Alimentador', icon: 'grain' },
        { key: 'tanque', title: 'Tanque', icon: 'fishbowl-outline' },
        { key: 'camera', title: 'Câmera', icon: 'camera-outline' },
        { key: 'comousar', title: 'Como Usar', icon: 'information-outline' },
        { key: 'conta', title:'Minha Conta',icon:'account' },
    ];

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'sensor':
                return <SensorDataScreen />;
            case 'alimentador':
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
            case 'conta':
                return <Conta/>;
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
