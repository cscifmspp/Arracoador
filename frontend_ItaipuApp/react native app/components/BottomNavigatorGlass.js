
//Isso aqui é so um esboço!!!!!
//Não é oficial nem nada, só um teste de como ficaria o bottom navigator com blur e tudo mais 

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import BlurViewCustom from './BlurViewCustom'; // componente personalizado de blur

import Alimentador from '../screens/Alimentador';
import Monitorar from '../screens/Monitorar';
import Tanque from '../screens/Tanque';
import Camera from '../screens/Camera';
import { Text } from 'react-native-paper';

const ComoUsar = () => <Text style={{ padding: 20 }}>Como Usar</Text>;

export default function BottomNavigatorGlass() {
    const [index, setIndex] = useState(0);

    const [tanques, setTanques] = useState([
        { nome: "teste", ip: "0.0.0.0" },
        { nome: "teste", ip: "0.0.0.0" }
    ]);

    const [alimentador, setAlimentador] = useState([
        { horario: "07:00", status: "OK", gramas: 300 }
    ]);

    const [tanqueIdx, setTanqueIdx] = useState([]);

    const screens = [
        {
            key: 'monitorar',
            icon: 'clipboard-text-search-outline',
            component: <Monitorar tanques={tanques} tanqueIdx={tanqueIdx} />
        },
        {
            key: 'alimentador',
            icon: 'grain',
            component: <Alimentador alimentador={alimentador} setAlimentador={setAlimentador} />
        },
        {
            key: 'tanque',
            icon: 'fishbowl-outline',
            component: <Tanque tanques={tanques} setTanques={setTanques} tanqueIdx={tanqueIdx} setTanqueIdx={setTanqueIdx} />
        },
        {
            key: 'camera',
            icon: 'camera-outline',
            component: <Camera />
        },
        {
            key: 'comoUsar',
            icon: 'information-outline',
            component: <ComoUsar />
        }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {screens[index].component}
            </View>

            <BlurViewCustom intensity={80} tint="light" style={styles.blur}>
                <BottomNavigation.Bar
                    navigationState={{
                        index,
                        routes: screens.map(screen => ({
                            key: screen.key,
                            title: screen.key.charAt(0).toUpperCase() + screen.key.slice(1),
                            icon: screen.icon
                        }))
                    }}
                    onIndexChange={setIndex}
                    renderScene={() => null} // cena já renderizada acima
                    barStyle={{ backgroundColor: 'transparent' }}
                />
            </BlurViewCustom>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        flex: 1
    },
    blur: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 70,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderTopWidth: 0.5,
        borderTopColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 50
    }
});
