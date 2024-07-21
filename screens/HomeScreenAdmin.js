import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, Image,ScrollView } from 'react-native';
import api from '../api';

const HomeScreenAdmin = ({ route,navigation }) => {
  const {name } = route.params;
  const [adminName, setAdminName] = useState(name);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Fetch admin
        setAdminName(name);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAdminData();
  }, []);

  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
  };
  const handleLogout = () => {
    setAdminName('');
    navigation.navigate('Login'); 
  };

  return (
    <ImageBackground
      source={require('../assets/afrolabMan.jpg')}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.centeredContainer}>
            <Image
              source={require('../assets/LOGO-AFROLAB-2.jpg')}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.title}>Tableau de bord de l'Admin </Text>
            <Text style={styles.subtitle}>{`Bienvenue, M. ${adminName}`}</Text>
            <View style={styles.buttonContainer}>
              <Pressable style={styles.button} onPress={() => navigateTo('ViewEmployeeAdmin')}>
                <Text style={styles.buttonText}>Voir les employés</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => navigateTo('ManageEmployeeAdmin')}>
                <Text style={styles.buttonText}>Gérer les employés</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => navigateTo('ViewDepartmentResponsibles')}>
                <Text style={styles.buttonText}>Voir les chefs de département</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => navigateTo('ManageDepartmentResponsibles')}>
                <Text style={styles.buttonText}>Gérer les chefs de département</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => navigateTo('ManageEquipment')}>
                <Text style={styles.buttonText}>Gérer les Articles</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => navigateTo('ReportSelectionScreenAdmin')}>
                <Text style={styles.buttonText}>Voir les rapports</Text>
              </Pressable>
              {/* Bouton de logout */}
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    width: 350,
  },
  centeredContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 33,
    marginBottom: 10,
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    color: '#FFF',
  },
  image: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  button: {
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    backgroundColor: '#FFD700',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  // Styles pour le bouton de logout
  logoutButton: {
    
    bottom: -25,
    left: 100,
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default HomeScreenAdmin;
