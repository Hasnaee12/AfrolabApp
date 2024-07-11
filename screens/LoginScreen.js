// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Pressable, ImageBackground, Image } from 'react-native';
import api from '../api';

const LoginScreen = ({ navigation, setUserRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/login', { email, password });
      if (response.data.message === 'Login successful') {
        const userRole = response.data.role; 
        const name = response.data.name; 
        const departmentName = response.data.departmentName; 
        setUserRole(userRole);

        // Navigate to appropriate screen based on role
        if (userRole === 'employee') {
          navigation.navigate('Home', { name });
        } else if (userRole === 'admin') {
          navigation.navigate('HomeScreenAdmin', {  name });
        } else if (userRole === 'superuser') {
          navigation.navigate('HomeScreenSuperuser', {  departmentName });
        }
      } else {
        Alert.alert('Login Failed', response.data.message);
      }
    } catch (error)  {
      if (error.response) {
        // La requête a été faite et le serveur a répondu avec un code d'erreur
        console.error('Error response:', error.response.data);
        console.error('Status code:', error.response.status);
        Alert.alert('Error', 'Failed to perform operation. Please try again later.');
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        console.error('No response received:', error.request);
        Alert.alert('Error', 'No response received from server. Please check your network connection.');
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error('Request setup error:', error.message);
        Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <ImageBackground
      source={require('../assets/afrolabMan.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={{ alignItems: "center", gap: 50 }}>
            <Image
              source={require('../assets/LOGO-AFROLAB-2.jpg')}
              style={styles.Image}
              resizeMode="contain"
            />
            <Text style={styles.title}>Login</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: pressed ? '#FFC107' : '#FFD700' },
            ]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 50% transparent black
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    width: 350,
  },
  title: {
    fontSize: 33,
    marginBottom: 16,
    textAlign: 'center',
    color: '#FFF', // White text
  },
  Image: {
    width: 200,
    height: 100,
    alignContent: "center",
    marginTop: 0,
    resizeMode: 'contain',
  },
  input: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#FFF',
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 23,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
