// hooks/useWebSocketConnection.js
import { useRef } from 'react';
import useWebSocket from 'react-use-websocket';

export function useWebSocketConnection(setConectado, setArracoadorId) {
  const statusInterval = useRef();

  const { sendMessage, lastMessage, readyState } = useWebSocket("ws://172.24.28.137:8000/ws/arracoador/", {
    onOpen: () => setConectado(true),
    onError: () => setConectado(false),
    onClose: () => setConectado(false),
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
          sendMessage("stat_ack");
          break;
      }
    },
    shouldReconnect: () => true,
    retryOnError: true,
  });

  return { sendMessage, lastMessage, readyState };
}
