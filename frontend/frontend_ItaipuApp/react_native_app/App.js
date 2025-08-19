import { useState, useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme, configureFonts } from 'react-native-paper'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import AppNavigation from './navigation/AppNavigation';
import { useWebSocketConnection } from './hooks/useWebSocketConnection';

function MainApp() {
  const { theme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [conectado, setConectado] = useState(false);
  const [arracoadorId, setArracoadorId] = useState(-1);

  useWebSocketConnection(setConectado, setArracoadorId);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  const fontConfig = useMemo(() => ({
    // ... (mantenha sua configuração de fontes)
  }), []);

  const paperTheme = useMemo(() => ({
    ...(theme.dark ? MD3DarkTheme : MD3LightTheme),
    colors: {
      ...(theme.dark ? MD3DarkTheme.colors : MD3LightTheme.colors),
      primary: theme.primary,
      secondary: theme.secondary,
      background: theme.background,
      surface: theme.surface,
      onSurface: theme.textPrimary,
      accent: theme.accent,
    },
    fonts: configureFonts({ config: fontConfig }),
  }), [theme, fontConfig]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.secondary} />
      </View>
    );
  }

  return (
    <PaperProvider
      theme={paperTheme}
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

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}