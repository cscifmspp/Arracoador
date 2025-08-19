import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importações de telas...
import DashboardScreen from '../screens/DashboardScreen';
import ControlesScreen from '../screens/ControlesScreen';
import FloatingDock from '../components/FloatingDock';
import Alimentador from '../screens/Alimentador';
import Camera from '../screens/Camera';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from  '../screens/LoginScreen';
import Tanque from '../screens/Tanque';
import ContaScreen from '../screens/ContaScreen';
import EditarContaScreen from '../screens/EditarContaScreen';
const Stack = createNativeStackNavigator();

function MainScreen({ component: Component }) {
  return (
    <View style={styles.container}>
      <Component />
      <FloatingDock />
    </View>
  );
}

export default function AppNavigation({ isAuthenticated, setIsAuthenticated }) {
  return (
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
          <>
            <Stack.Screen name="Dashboard">
              {() => <MainScreen component={DashboardScreen} />}
            </Stack.Screen>
            <Stack.Screen name="Controles">
              {() => <MainScreen component={ControlesScreen} />}
            </Stack.Screen>
            <Stack.Screen name="Conta">
            {() => <MainScreen component={ContaScreen} />}
            </Stack.Screen>
            <Stack.Screen name="Tanque">
              {() => <MainScreen component={Tanque} />}
            </Stack.Screen>
            <Stack.Screen name="Alimentador" component={Alimentador} />
            <Stack.Screen name="Camera" component={Camera} />
            <Stack.Screen name = "EditarConta">
              {() => <MainScreen component={EditarContaScreen} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});