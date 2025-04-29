import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from 'react-native';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper'; 
import useWebSocket from "react-use-websocket";

import BottomNavigatorGlass from './components/BottomNavigatorGlass';
import Header from './components/Header';

export default function App() {
  const [conectado, setConectado] = useState(false);
  const [arracoadorId, setArracoadorId] = useState(-1);

  const statusInterval = useRef();

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://192.168.1.46:8000/ws/arracoador/",
    {
      onOpen: () => { setConectado(true); },
      onError: () => { setConectado(false); },
      onClose: () => { setConectado(false); },
      onMessage: (msg) => {
        const parsed = msg.data.split("|");
        console.log(parsed);

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
            console.log(peso, tempo, servo);
            sendMessage("stat_ack");
            break;
        }
      },
      shouldReconnect: () => true,
      retryOnError: true
    }
  );

  return (
    <PaperProvider theme={MD3DarkTheme}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
        <Header conectado={conectado} />
        <BottomNavigatorGlass />
      </SafeAreaView>
    </PaperProvider>
  );
}
