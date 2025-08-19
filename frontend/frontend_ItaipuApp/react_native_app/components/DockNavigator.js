import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DashboardScreen from '../screens/DashboardScreen';
import Controles from '../screens/Controles';
import Configuracoes from '../screens/Configuracoes';

export default function DockNavigator() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const screens = [
    { component: <DashboardScreen />, icon: 'view-dashboard-outline', label: 'Dashboard' },
    { component: <Controles />, icon: 'toggle-switch-outline', label: 'Controles' },
    { component: <Configuracoes />, icon: 'account', label: 'Config' },
  ];

  return (
    <View style={styles.container}>
      {/* Renderiza tela ativa */}
      <View style={{ flex: 1 }}>{screens[activeIndex].component}</View>

      {/* Dock flutuante */}
      <View style={styles.dockWrapper}>
        <MotiView
          style={styles.dockPanel}
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 12 }}
        >
          {screens.map((item, index) => {
            const isActive = index === activeIndex;
            const isHovered = index === hoveredIndex;
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.9}
                onPress={() => setActiveIndex(index)}
                onPressIn={() => setHoveredIndex(index)}
                onPressOut={() => setHoveredIndex(null)}
              >
                <MotiView
                  style={styles.dockItem}
                  animate={{
                    scale: isHovered || isActive ? 1.3 : 1,
                    translateY: isHovered || isActive ? -6 : 0,
                  }}
                  transition={{ type: 'spring', damping: 12 }}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={28}
                    color={isActive ? '#00bfff' : '#ffffff'}
                  />
                  <AnimatePresence>
                    {isActive && (
                      <MotiView
                        from={{ opacity: 0, translateY: 0 }}
                        animate={{ opacity: 1, translateY: -10 }}
                        exit={{ opacity: 0, translateY: 0 }}
                        style={styles.labelWrapper}
                      >
                        <Text style={styles.label}>{item.label}</Text>
                      </MotiView>
                    )}
                  </AnimatePresence>
                </MotiView>
              </TouchableOpacity>
            );
          })}
        </MotiView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  dockWrapper: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  dockPanel: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(6,0,16,0.8)', // translúcido
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222',
    gap: 16,
  },
  dockItem: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(6,0,16,0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  labelWrapper: {
    position: 'absolute',
    top: -20,
    backgroundColor: '#060010',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#222',
  },
  label: {
    color: '#fff',
    fontSize: 12,
  },
});
