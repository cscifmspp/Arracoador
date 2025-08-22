import React, { useState } from 'react';
import { View, Text, Button, TextInput, ScrollView } from 'react-native';
import axios from 'axios';

const TesteConexao = () => {
  const [ip, setIp] = useState('10.42.0.42');
  const [resultado, setResultado] = useState('');
  const [loading, setLoading] = useState(false);

  const testarConexao = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://${ip}`, { timeout: 5000 });
      setResultado(`✅ CONECTADO!\nResposta: ${response.data}`);
    } catch (error) {
      setResultado(`❌ ERRO: ${error.message}\n\nCausas possíveis:\n1. IP errado\n2. Rede diferente\n3. Firewall\n4. ESP desconectado`);
    }
    setLoading(false);
  };

  const testarRotaPeso = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://${ip}/peso`, { timeout: 5000 });
      setResultado(`✅ PESO OK!\nDados: ${JSON.stringify(response.data)}`);
    } catch (error) {
      setResultado(`❌ ERRO no /peso: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
        Teste de Conexão ESP8266
      </Text>

      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        value={ip}
        onChangeText={setIp}
        placeholder="Digite o IP do ESP"
      />

      <Button title="Testar Conexão Básica" onPress={testarConexao} disabled={loading} />
      <Button title="Testar Rota /peso" onPress={testarRotaPeso} disabled={loading} />

      {loading && <Text>Testando...</Text>}
      
      <Text style={{ marginTop: 20, backgroundColor: '#f0f0f0', padding: 10 }}>
        {resultado}
      </Text>

      <Text style={{ marginTop: 20, fontSize: 12 }}>
        💡 Dica: Use hotspot do celular ou rede doméstica
      </Text>
    </ScrollView>
  );
};

export default TesteConexao;