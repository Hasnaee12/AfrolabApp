import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, Image } from 'react-native';
import api from '../api';

const HomeScreenSuperuser = ({ navigation }) => {
  const [superuserName, setSuperuserName] = useState('');
  const [superuserDepartment, setSuperuserDepartment] = useState('');
  const [superuserDepartmentId, setSuperuserDepartmentId] = useState(null); // Ajout du state pour l'ID du département

  useEffect(() => {
    const fetchSuperuserData = async () => {
      try {
        // Fetch departments
        const departmentsResponse = await api.get('/departments');
        const departments = departmentsResponse.data;

        // Fetch superuser
        const superuserResponse = await api.get('/collaborators?role=superuser');
        const superuser = superuserResponse.data[0];

        setSuperuserName(superuser.name);

        // Find the department of the superuser
        const department = departments.find(dept => dept.id === superuser.department_id);
        setSuperuserDepartment(department ? department.name : 'Unknown Department');
        setSuperuserDepartmentId(superuser.department_id); // Set department ID

      } catch (error) {
        console.error(error);
      }
    };

    fetchSuperuserData();
  }, []);

  const navigateTo = (screenName) => {
    navigation.navigate(screenName, { userDepartmentId: superuserDepartmentId });
  };
  
  const handleLogout = () => {
    setSuperuserName('');
    setSuperuserDepartment('');
    setSuperuserDepartmentId(null);
    // Naviguer vers l'écran de connexion
    navigation.navigate('Login'); 
  };

  


  return (
    <ImageBackground
      source={require('../assets/afrolabMan.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.centeredContainer}>
            <Image
              source={require('../assets/LOGO-AFROLAB-2.jpg')}
              style={styles.image}
            />
            <Text style={styles.title}>{`${superuserDepartment} Responsible Dashboard`}</Text>
            <Text style={styles.subtitle}>{`Welcome, ${superuserName}`}</Text>
            <View style={styles.buttonContainer}>
              <Pressable style={styles.button} onPress={() => navigateTo('ViewEmployeeSuperuser')}>
                <Text style={styles.buttonText}>View Employees</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => navigateTo('ManageEmployeeSuperuser')}>
                <Text style={styles.buttonText}>Manage Employees</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => navigateTo('ManageDefinedTask')}>
                <Text style={styles.buttonText}>Manage Defined Tasks</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => navigateTo('ViewReportsSuperuser')}>
                <Text style={styles.buttonText}>View Reports</Text>
              </Pressable>
               {/* Bouton de logout */}
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
            </View>
          </View>
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
    fontSize: 25,
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
    
    bottom: -30,
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

export default HomeScreenSuperuser;
