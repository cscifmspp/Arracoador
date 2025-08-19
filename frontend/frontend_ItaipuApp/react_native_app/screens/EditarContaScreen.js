import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Avatar, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import Config from '../config'; // Importação do arquivo de configuração

export default function EditarContaScreen({ navigation }) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    telefone: '',
    foto: null
  });

  // Carrega os dados do perfil ao iniciar
  useEffect(() => {
    const loadProfile = async () => {
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
    };

    loadProfile();
  }, [navigation]);

  // Seleciona imagem da galeria
  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos acessar sua galeria para alterar a foto');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setUserData({ ...userData, foto: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  // Salva as alterações no perfil
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
      formData.append('first_name', userData.nome);
      formData.append('nome', userData.nome);
      formData.append('email', userData.email);
      
      if (userData.telefone) {
        formData.append('phone', userData.telefone);
        formData.append('telefone', userData.telefone);
      }

      if (userData.foto && userData.foto.startsWith('file:')) {
        formData.append('foto_perfil', {
          uri: userData.foto,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }

      const response = await fetch(Config.getUrl('profileUpdate'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      // Verifica se a resposta é JSON válido
      const contentType = response.headers.get('content-type');
      let responseData;
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Resposta inválida: ${text}`);
      }

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Erro ao atualizar perfil');
      }

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      Alert.alert('Erro', error.message || 'Falha ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator animating={true} size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={handleImagePick}>
          {userData.foto ? (
            <Image 
              source={{ uri: userData.foto }} 
              style={[styles.avatar, { borderColor: theme.primary }]} 
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
        onChangeText={(text) => setUserData({...userData, nome: text})}
        style={[styles.input, { backgroundColor: theme.surface }]}
        textColor={theme.textPrimary}
        mode="outlined"
      />

      <TextInput
        label="Email"
        value={userData.email}
        onChangeText={(text) => setUserData({...userData, email: text})}
        keyboardType="email-address"
        style={[styles.input, { backgroundColor: theme.surface }]}
        textColor={theme.textPrimary}
        mode="outlined"
        disabled
      />

      <TextInput
        label="Telefone"
        value={userData.telefone}
        onChangeText={(text) => setUserData({...userData, telefone: text})}
        keyboardType="phone-pad"
        style={[styles.input, { backgroundColor: theme.surface }]}
        textColor={theme.textPrimary}
        mode="outlined"
      />

      <Button 
        mode="contained" 
        onPress={handleSave}
        style={[styles.saveButton, { backgroundColor: theme.primary }]}
        labelStyle={{ color: 'white' }}
        disabled={loading}
      >
        {loading ? 'Salvando...' : 'Salvar Alterações'}
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
  },
});