// hooks/useWebSocketConnection.js
import { useRef, useCallback, useEffect } from 'react';

export function useWebSocketConnection(setConectado, setArracoadorId) {
  const ws = useRef(null);
  const statusInterval = useRef();
  const reconnectTimeout = useRef();

  const sendMessage = useCallback((message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    }
  }, []);

  const connect = useCallback(() => {
    try {
      // CORREÇÃO: URL correta (removi a barra extra)
      ws.current = new WebSocket('ws://192.168.137.66:8000/ws/arracoador/');
      
      ws.current.onopen = () => {
        console.log('WebSocket conectado');
        setConectado(true);
      };

      ws.current.onmessage = (event) => {
        const message = event.data;
        const parsed = message.split("|");
        
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
          default:
            console.log('Mensagem recebida:', message);
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket desconectado');
        setConectado(false);
        setArracoadorId(-1);
        if (statusInterval.current) clearInterval(statusInterval.current);
        
        // Reconexão automática após 3 segundos
        reconnectTimeout.current = setTimeout(connect, 3000);
      };

      ws.current.onerror = (error) => {
        console.error('Erro WebSocket:', error);
        setConectado(false);
        setArracoadorId(-1);
      };

    } catch (error) {
      console.error('Falha na conexão WebSocket:', error);
      reconnectTimeout.current = setTimeout(connect, 3000);
    }
  }, [setConectado, setArracoadorId, sendMessage]);

  // Efeito para conectar e limpar
  useEffect(() => {
    connect();
    
    return () => {
      // Limpeza
      if (ws.current) {
        ws.current.close();
      }
      if (statusInterval.current) {
        clearInterval(statusInterval.current);
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [connect]);

  return { 
    sendMessage, 
    readyState: ws.current ? ws.current.readyState : WebSocket.CONNECTING 
  };
}