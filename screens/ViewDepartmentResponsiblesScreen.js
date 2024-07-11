import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import api from '../api';
import { LinearGradient } from 'expo-linear-gradient';

const ViewEmployeeScreen = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get('/collaborators?role=superuser'); // Assurez-vous que votre API retourne tous les employés avec toutes les informations nécessaires
        setEmployees(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <LinearGradient
      colors={['#FF8C04', '#0BECFB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Employee List</Text>
          <FlatList
            data={employees}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text>Name: {item.name}</Text>
                <Text>Email: {item.email}</Text>
                <Text>Phone: {item.phone_number}</Text>
                <Text>Role: {item.role}</Text>
                <Text>Password: {item.password}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFF', // White text
    fontWeight: 'bold',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    width: '100%',
  },
});

export default ViewEmployeeScreen;
