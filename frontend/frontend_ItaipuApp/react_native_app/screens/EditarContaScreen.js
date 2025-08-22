import React, { useState, useEffect, useCallback } from 'react';
import {View,StyleSheet,ScrollView,Alert,Image,TouchableOpacity,RefreshControl} from 'react-native';
import { TextInput, Button, Text, Avatar, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import Config from '../config';
import { useFocusEffect } from '@react-navigation/native';

export default function EditarContaScreen({ navigation }) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    telefone: '',
    foto: null
  });

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
      setRefreshing(false);
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProfile();
  }, [loadProfile]);

  // FUNÇÃO CORRIGIDA - COMPATÍVEL COM TODAS VERSÕES
  const handleImagePick = async () => {
    try {
      console.log('Solicitando permissões...');
      
      // Solicitar permissões
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Resultado da permissão:', permissionResult);
      
      if (permissionResult.status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos acessar sua galeria para alterar a foto');
        return;
      }

      console.log('Abrindo galeria...');
      
      // Método universalmente compatível
      const result = await ImagePicker.launchImageLibraryAsync({
        // Usando a abordagem mais compatível
        mediaTypes: 'images', // String simples que funciona em todas versões
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Resultado completo:', result);

      if (result.canceled) {
        console.log('Usuário cancelou a seleção');
        return;
      }

      // Extrair a URI da imagem de forma compatível
      let imageUri;
      
      // Para versões mais novas (assets array)
      if (result.assets && result.assets.length > 0) {
        imageUri = result.assets[0].uri;
      } 
      // Para versões mais antigas (uri direta)
      else if (result.uri) {
        imageUri = result.uri;
      }

      console.log('URI da imagem selecionada:', imageUri);

      if (imageUri) {
        setUserData(prev => ({ ...prev, foto: imageUri }));
        Alert.alert('Sucesso', 'Imagem selecionada com sucesso!');
      } else {
        throw new Error('Não foi possível obter a URI da imagem');
      }

    } catch (error) {
      console.error('Erro detalhado ao selecionar imagem:', error);
      
      // Tentativa alternativa EXTRA segura
      try {
        console.log('Tentando método ultra compatível...');
        const fallbackResult = await ImagePicker.launchImageLibraryAsync({
          // Opções mínimas e mais compatíveis
          allowsEditing: true,
          quality: 0.8,
        });

        console.log('Resultado fallback:', fallbackResult);

        if (!fallbackResult.canceled) {
          const fallbackUri = fallbackResult.uri || 
                            (fallbackResult.assets && fallbackResult.assets[0]?.uri);
          if (fallbackUri) {
            setUserData(prev => ({ ...prev, foto: fallbackUri }));
            Alert.alert('Sucesso', 'Imagem selecionada com sucesso!');
            return;
          }
        }
      } catch (fallbackError) {
        console.error('Erro no fallback:', fallbackError);
      }
      
      Alert.alert('Erro', 'Não foi possível selecionar a imagem. Tente novamente.');
    }
  };

  const handleSave = async () => {
    if (!userData.nome.trim()) {
      Alert.alert('Erro', 'O nome é obrigatório');
      return;
    }

    try {
      setLoading(true);
      const token = await Config.getAuthToken();
      
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      const formData = new FormData();
      formData.append('first_name', userData.nome.trim());
      formData.append('nome', userData.nome.trim());
      formData.append('email', userData.email.trim());
      
      if (userData.telefone) {
        formData.append('phone', userData.telefone.trim());
        formData.append('telefone', userData.telefone.trim());
      }

      if (userData.foto && userData.foto.startsWith('file:')) {
        console.log('Enviando imagem:', userData.foto);
        formData.append('foto_perfil', {
          uri: userData.foto,
          type: 'image/jpeg',
          name: `profile_${Date.now()}.jpg`,
        });
      }

      console.log('Enviando dados para atualização de perfil...');
      const response = await fetch(Config.getUrl('profileUpdate'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (response.status === 401) {
        await Config.removeAuthToken();
        navigation.navigate('Login');
        return;
      }

      const responseText = await response.text();
      console.log('Resposta bruta do servidor:', responseText);
      
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
        console.log('Dados parseados:', responseData);
      } catch {
        console.error('Não foi possível parsear JSON:', responseText);
        throw new Error(`Resposta inválida do servidor: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Erro ao atualizar perfil');
      }

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { 
          text: 'OK', 
          onPress: () => {
            navigation.navigate('Conta', { refresh: Date.now() });
          }
        }
      ]);
      
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      Alert.alert('Erro', error.message || 'Falha ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !refreshing) {
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
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.primary]}
        />
      }
    >
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={handleImagePick} disabled={loading}>
          {userData.foto ? (
            <Image 
              source={{ uri: userData.foto }} 
              style={[styles.avatar, { borderColor: theme.primary }]} 
              onError={(e) => {
                console.log('Erro ao carregar imagem:', e.nativeEvent.error);
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
        </TouchableOpacity>
        <Text style={[styles.changePhotoText, { color: theme.primary }]}>
          Toque para alterar a foto
        </Text>
      </View>

      <TextInput
        label="Nome Completo"
        value={userData.nome}
        onChangeText={(text) => setUserData(prev => ({...prev, nome: text}))}
        style={[styles.input, { backgroundColor: theme.surface }]}
        textColor={theme.textPrimary}
        mode="outlined"
        disabled={loading}
      />

      <TextInput
        label="Email"
        value={userData.email}
        onChangeText={(text) => setUserData(prev => ({...prev, email: text}))}
        keyboardType="email-address"
        style={[styles.input, { backgroundColor: theme.surface }]}
        textColor={theme.textPrimary}
        mode="outlined"
        disabled={true}
      />

      <TextInput
        label="Telefone"
        value={userData.telefone}
        onChangeText={(text) => setUserData(prev => ({...prev, telefone: text}))}
        keyboardType="phone-pad"
        style={[styles.input, { backgroundColor: theme.surface }]}
        textColor={theme.textPrimary}
        mode="outlined"
        disabled={loading}
      />

      <Button 
        mode="contained" 
        onPress={handleSave}
        style={[styles.saveButton, { backgroundColor: theme.primary }]}
        labelStyle={{ color: 'white' }}
        disabled={loading}
        loading={loading}
      >
        Salvar Alterações
      </Button>

      <Button 
        mode="outlined" 
        onPress={() => navigation.goBack()}
        style={[styles.cancelButton, { borderColor: theme.primary }]}
        labelStyle={{ color: theme.primary }}
        disabled={loading}
      >
        Cancelar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
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
    marginVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
  },
  changePhotoText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    marginBottom: 15,
    borderRadius: 8,
  },
  saveButton: {
    marginTop: 25,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 15,
  },
  cancelButton: {
    borderRadius: 8,
  },
});