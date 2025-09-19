import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DashboardScreen from '../screens/DashboardScreen';
import ControlesScreen from '../screens/ControlesScreen';
import ContaScreen from '../screens/ContaScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F5F5F5 ',
          height: 70,
        },
        tabBarActiveTintColor: '#007C91',
        tabBarInactiveTintColor: '#B0BEC5',
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'view-dashboard-outline';
          if (route.name === 'Controles') iconName = 'toggle-switch-outline';
          if (route.name === 'Conta') iconName = 'account-circle-outline';
          return <MaterialCommunityIcons name={iconName} size={28} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Controles" component={ControlesScreen} />
      <Tab.Screen name="Conta" component={ContaScreen} />
    </Tab.Navigator>
  );
}
