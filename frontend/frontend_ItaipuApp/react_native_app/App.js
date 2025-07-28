// App.js
import { useState } from "react";
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AppNavigation from './navigation/AppNavigation';
import { useWebSocketConnection } from './hooks/useWebSocketConnection';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [conectado, setConectado] = useState(false);
  const [arracoadorId, setArracoadorId] = useState(-1);

  useWebSocketConnection(setConectado, setArracoadorId);

  return (
    <PaperProvider
      theme={MD3DarkTheme}
      settings={{ icon: props => <MaterialCommunityIcons {...props} /> }}
    >
      <AppNavigation 
        isAuthenticated={isAuthenticated} 
        setIsAuthenticated={setIsAuthenticated} 
        conectado={conectado} 
      />
    </PaperProvider>
  );
}
