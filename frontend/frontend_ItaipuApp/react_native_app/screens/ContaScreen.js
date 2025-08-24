import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, Switch } from 'react-native';
import { Text, Card, Button, Avatar, ActivityIndicator } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import Config from '../config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ContaScreen() {
  const { theme, toggleTheme, isDark } = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    telefone: '',
    foto: null
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const token = await Config.getAuthToken();
      
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      const response = await fetch(Config.getUrl('profile'), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        await Config.removeAuthToken();
        navigation.navigate('Login');
        return;
      }

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      setUserData({
        nome: data.nome || data.first_name || '',
        email: data.email || '',
        telefone: data.telefone || data.phone || '',
        foto: data.foto_perfil || data.profile_photo || null,
      });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil');
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  // Recarregar dados quando a tela receber foco
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const handleLogout = async () => {
    try {
      await Config.removeAuthToken();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(prev => !prev);
    Alert.alert(
      'Notificações',
      notificationsEnabled ? 'Notificações desativadas' : 'Notificações ativadas'
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator animating={true} size="large" color={theme.primary} />
        <Text style={{ color: theme.textPrimary, marginTop: 10 }}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          {userData.foto ? (
            <Image 
              source={{ uri: userData.foto + `?t=${Date.now()}` }}
              style={[styles.avatar, { borderColor: theme.primary }]}
              onError={() => {
                setUserData(prev => ({ ...prev, foto: null }));
              }}
            />
          ) : (
            <Avatar.Icon 
              size={120} 
              icon="account" 
              style={{ backgroundColor: theme.primary }} 
            />
          )}
          <Text style={[styles.userName, { color: theme.textPrimary }]}>
            {userData.nome}
          </Text>
        </View>

        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          <Card.Title
            title="Informações Pessoais"
            titleStyle={{ color: theme.textPrimary }}
            left={(props) => (
              <Avatar.Icon 
                {...props} 
                icon="account-details" 
                style={{ backgroundColor: theme.primary }} 
              />
            )}
          />
          <Card.Content>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="email" size={20} color={theme.textSecondary} />
              <Text style={[styles.infoText, { color: theme.textPrimary }]}>
                {userData.email}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="phone" size={20} color={theme.textSecondary} />
              <Text style={[styles.infoText, { color: theme.textPrimary }]}>
                {userData.telefone || 'Não informado'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          <Card.Title
            title="Preferências"
            titleStyle={{ color: theme.textPrimary }}
            left={(props) => (
              <Avatar.Icon 
                {...props} 
                icon="cog" 
                style={{ backgroundColor: theme.primary }} 
              />
            )}
          />
          <Card.Content>
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceInfo}>
                <MaterialCommunityIcons name="bell" size={20} color={theme.textPrimary} />
                <Text style={[styles.preferenceText, { color: theme.textPrimary }]}>
                  Notificações
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                thumbColor={notificationsEnabled ? theme.primary : '#f4f3f4'}
                trackColor={{ false: '#767577', true: theme.primary + '80' }}
              />
            </View>

            <View style={styles.preferenceRow}>
              <View style={styles.preferenceInfo}>
                <MaterialCommunityIcons 
                  name={isDark ? "weather-night" : "weather-sunny"} 
                  size={20} 
                  color={theme.textPrimary} 
                />
                <Text style={[styles.preferenceText, { color: theme.textPrimary }]}>
                  Modo Noturno
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                thumbColor={isDark ? theme.primary : '#f4f3f4'}
                trackColor={{ false: '#767577', true: theme.primary + '80' }}
              />
            </View>
          </Card.Content>
        </Card>

        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('EditarConta')}
          style={[styles.editButton, { backgroundColor: theme.primary }]}
          labelStyle={{ color: 'white' }}
          icon="account-edit"
        >
          Editar Perfil
        </Button>

        <Button 
          mode="outlined" 
          onPress={handleLogout}
          style={[styles.logoutButton, { borderColor: theme.error }]}
          labelStyle={{ color: theme.error }}
          icon="logout"
        >
          Sair
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginTop: 15,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceText: {
    fontSize: 16,
    marginLeft: 10,
  },
  editButton: {
    borderRadius: 8,
    marginBottom: 15,
    paddingVertical: 6,
  },
  logoutButton: {
    borderRadius: 8,
  },
});