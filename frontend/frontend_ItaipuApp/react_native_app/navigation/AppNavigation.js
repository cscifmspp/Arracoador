// navigation/AppNavigation.js
import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BottomNavigatorGlass from '../components/BottomNavigatorGlass';
import Header from '../components/Header';

const Stack = createNativeStackNavigator();

export default function AppNavigation({ isAuthenticated, setIsAuthenticated, conectado }) {
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
  );
}
