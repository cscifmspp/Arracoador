import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

const items = [
  { name: 'Dashboard', icon: 'view-dashboard-outline', label: 'Dashboard' },
  { name: 'Controles', icon: 'toggle-switch-outline', label: 'Controles' },
  { name: 'Conta', icon: 'account', label: 'Conta' },
];

export default function FloatingDock() {
  const navigation = useNavigation();
  const route = useRoute();

  const isSubRoute = ['Alimentador', 'Camera'].includes(route.name);

  return (
    <View style={styles.dockWrapper}>
      <MotiView 
        style={styles.dockPanel}
        from={{ opacity: 0, translateY: 40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {items.map((item, index) => {
          const isActive = route.name === item.name || 
                         (item.name === 'Controles' && isSubRoute);

          return (
            <TouchableOpacity 
              key={index} 
              onPress={() => navigation.navigate(item.name)}
              activeOpacity={0.8}
            >
              <View style={styles.itemWrapper}>
                {isActive && (
                  <MotiView
                    style={styles.labelWrapper}
                    from={{ opacity: 0, translateY: 0 }}
                    animate={{ opacity: 1, translateY: -6 }}
                  >
                    <Text style={styles.label}>{item.label}</Text>
                  </MotiView>
                )}

                <MotiView
                  style={styles.dockItem}
                  animate={{
                    scale: isActive ? 1.4 : 1,
                    translateY: isActive ? -8 : 0,
                  }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <MaterialCommunityIcons 
                    name={item.icon} 
                    size={26} 
                    color={isActive ? '#A4FF73' : '#B2EBF2'} 
                  />
                </MotiView>
              </View>
            </TouchableOpacity>
          );
        })}
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  dockWrapper: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  dockPanel: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(6,0,16,0.6)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#222',
    gap: 16,
    backdropFilter: 'blur(10px)', // efeito vidro em web
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  itemWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  dockItem: {
    width: 52,
    height: 52,
    backgroundColor: 'rgba(6,0,16,0.85)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  labelWrapper: {
    position: 'absolute',
    top: -40,
    backgroundColor: '#060010',
    paddingHorizontal: 1,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#222',
  },
  label: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
