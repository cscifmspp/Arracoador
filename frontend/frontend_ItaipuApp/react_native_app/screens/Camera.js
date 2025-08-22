import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Button, Avatar } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Camera() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isStreaming, setIsStreaming] = useState(false);
  const [imageUri] = useState("https://preview.redd.it/what-is-your-opinion-on-zundamon-v0-g343a8wh42rd1.jpeg?auto=webp&s=de7b7c6c9981a92d887b34686adcb80533866adb");

  const toggleStream = () => {
    setIsStreaming(!isStreaming);
    Alert.alert(isStreaming ? "Stream encerrado" : "Stream iniciado");
  };

  const takeSnapshot = () => {
    Alert.alert("Snapshot", "Captura de tela realizada!");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={theme.textPrimary} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: theme.textPrimary }]}>Câmera ao Vivo</Text>

      <Card style={[styles.card, { backgroundColor: theme.surface }]}>
        <Card.Title
          title="Visualização da Câmera"
          titleStyle={{ color: theme.textPrimary }}
          left={(props) => (
            <Avatar.Icon 
              {...props} 
              icon="camera" 
              style={{ backgroundColor: theme.primary }} 
            />
          )}
        />
        <Card.Content>
          <View style={styles.cameraContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.cameraImage}
              resizeMode="cover"
            />
            <View style={styles.overlayControls}>
              <Button
                mode="contained"
                onPress={toggleStream}
                style={[
                  styles.controlButton,
                  { 
                    backgroundColor: isStreaming ? theme.error : theme.primary 
                  }
                ]}
                icon={isStreaming ? "stop" : "play"}
              >
                {isStreaming ? "Parar" : "Iniciar"}
              </Button>
              
              <Button
                mode="contained"
                onPress={takeSnapshot}
                style={[styles.controlButton, { backgroundColor: theme.secondary }]}
                icon="camera"
                disabled={!isStreaming}
              >
                Capturar
              </Button>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.surface }]}>
        <Card.Title
          title="Controles da Câmera"
          titleStyle={{ color: theme.textPrimary }}
          left={(props) => (
            <Avatar.Icon 
              {...props} 
              icon="video" 
              style={{ backgroundColor: theme.primary }} 
            />
          )}
        />
        <Card.Content>
          <View style={styles.controlsRow}>
            <Button
              mode="outlined"
              onPress={() => Alert.alert("Zoom +")}
              style={[styles.smallButton, { borderColor: theme.primary }]}
              textColor={theme.primary}
              icon="magnify-plus"
            >
              Zoom +
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => Alert.alert("Zoom -")}
              style={[styles.smallButton, { borderColor: theme.primary }]}
              textColor={theme.primary}
              icon="magnify-minus"
            >
              Zoom -
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => Alert.alert("Rotação")}
              style={[styles.smallButton, { borderColor: theme.primary }]}
              textColor={theme.primary}
              icon="rotate-right"
            >
              Girar
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Text style={[styles.statusText, { color: theme.textSecondary }]}>
        Status: {isStreaming ? "Transmitindo..." : "Offline"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 50,
    padding: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    marginBottom: 20,
  },
  cameraContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cameraImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  overlayControls: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    gap: 10,
  },
  controlButton: {
    borderRadius: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  smallButton: {
    borderRadius: 8,
  },
  statusText: {
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});