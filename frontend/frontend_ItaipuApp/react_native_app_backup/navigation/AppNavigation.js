// AppNavigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importações de telas
import BottomTabs from '../components/BottomTabs'; // seu arquivo de tabs
import Alimentador from '../screens/Alimentador';
import Camera from '../screens/Camera';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import EditarContaScreen from '../screens/EditarContaScreen';
import VerificationScreen from '../screens/VerificationScreen';
import Tanque from '../screens/Tanque';

const Stack = createNativeStackNavigator();

export default function AppNavigation({ isAuthenticated, setIsAuthenticated }) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen
                  {...props}
                  onLogin={() => setIsAuthenticated(true)}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Verification" component={VerificationScreen} />
          </>
        ) : (
          <>
            {/* ✅ Tabs com Dashboard, Controles, Conta */}
            <Stack.Screen name="Home" component={BottomTabs} />

            {/* ✅ Extras fora do tab bar */}
            <Stack.Screen name="Alimentador" component={Alimentador} />
            <Stack.Screen name="Camera" component={Camera} />
            <Stack.Screen name="EditarConta" component={EditarContaScreen} />
            <Stack.Screen name="Tanque" component={Tanque} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
