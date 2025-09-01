// src/config.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const Config = {
  // Endereço base da API
  API_BASE: 'http://192.168.137.66:8000',
  
  // Endpoints da API
  ENDPOINTS: {
    profile: '/api/profile/',
    profileUpdate: '/api/profile/update/',
    register: '/api/auth/register/',
    login: '/api/auth/login/',
    verifyCode: '/api/auth/verify-code/',
    resendCode: '/api/auth/resend-code/'
  },
  
  // Método para gerar URLs completas
  getUrl: (endpoint) => {
    const endpointPath = Config.ENDPOINTS[endpoint];
    
    if (!endpointPath) {
      console.error(`Endpoint "${endpoint}" não encontrado`);
      return `${Config.API_BASE}/api/`;
    }
    
    return `${Config.API_BASE}${endpointPath}`;
  },
  
  // Obter token de autenticação
  getAuthToken: async () => {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return null;
    }
  },
  
  // Headers para requisições autenticadas
  getAuthHeaders: async () => {
    const token = await Config.getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  },
  
  // Headers para upload de arquivos
  getMultipartHeaders: async () => {
    const token = await Config.getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    };
  }
};

export default Config;