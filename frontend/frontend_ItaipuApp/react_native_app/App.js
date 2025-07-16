import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from 'react-native';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useWebSocket from "react-use-websocket";

import BottomNavigatorGlass from './components/BottomNavigatorGlass';
import Header from './components/Header';

// Importação para navegação
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Telas de login/cadastro
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // novo estado
  const [conectado, setConectado] = useState(false);
  const [arracoadorId, setArracoadorId] = useState(-1);
  const statusInterval = useRef();

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://192.168.24.229:8000/ws/arracoador/",
    {
      onOpen: () => { setConectado(true); },
      onError: () => { setConectado(false); },
      onClose: () => { setConectado(false); },
      onMessage: (msg) => {
        const parsed = msg.data.split("|");
        switch (parsed[0]) {
          case "ident":
            sendMessage("ident|1");
            break;
          case "connect":
            setArracoadorId(Number(parsed[1]));
            if (statusInterval.current) clearInterval(statusInterval.current);
            statusInterval.current = setInterval(() => {
              sendMessage("dstat|" + parsed[1]);
            }, 1000);
            break;
          case "disconnect":
            setArracoadorId(-1);
            if (statusInterval.current) clearInterval(statusInterval.current);
            break;
          case "stat":
            const [, peso, tempo, servo] = parsed;
            sendMessage("stat_ack");
            break;
        }
      },
      shouldReconnect: () => true,
      retryOnError: true
    }
  );

  return (
    <PaperProvider
      theme={MD3DarkTheme}
      settings={{ icon: props => <MaterialCommunityIcons {...props} /> }}
    >
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="Login">
                {props => <LoginScreen {...props} onLogin={() => setIsAuthenticated(true)} />}
              </Stack.Screen>
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <Stack.Screen name="MainApp">
              {() => (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
                  <Header conectado={conectado} />
                  <BottomNavigatorGlass />
                </SafeAreaView>
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
