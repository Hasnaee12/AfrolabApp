import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import api from '../api';
import { LinearGradient } from 'expo-linear-gradient';

const ViewEmployeeScreen = ({ route = { params: { userDepartmentId: '' } } }) => {
  const [employees, setEmployees] = useState([]);
  const { userDepartmentId } = route.params;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get(`/collaborators?role=employee&department_id=${userDepartmentId}`);
        setEmployees(response.data);
        
      } catch (error) {
        console.error(error);
      }
    };
    fetchEmployees();
  }, []);

  // Function to get the department name based on the department ID
  const getDepartmentName = (departmentId) => {
    switch(departmentId) {
      case 1:
        return 'Technique';
      case 2:
        return 'Commercial';
      case 3:
        return 'Financier';
      default:
        return 'Unknown';
    }
  };

  return (
    <LinearGradient
      colors={['#FF8C04', '#0BECFB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Liste des Employées </Text>
          <FlatList
            data={employees}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text>Nom: {item.name}</Text>
                <Text>Email: {item.email}</Text>
                <Text>TéléPhone: {item.phone_number}</Text>
                <Text>Role: Manager</Text>
                <Text>Mot de passe: {item.password}</Text>
                <Text>Nom de Département : {getDepartmentName(item.department_id)}</Text>
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
