import React,{ useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable ,ImageBackground,Image} from 'react-native';
import api from '../api';

const HomeScreen = ({ navigation,route }) => {
  const {name , userId ,department_id,departmentName} = route.params;
  const [employeeName, setemployeeName] = useState(name);
  const [employeeId, setemployeeId] = useState(userId);
  const [employeeDepartment, setemployeeDepartment] = useState(departmentName);
  const [employeeDepartmentId, setemployeeDepartmentId] = useState(department_id); // Ajout du state pour l'ID du département
  useEffect(() => {
    const fetchemployeeData = async () => {
      try {
        
        setemployeeName(name);
        setemployeeId(userId);
        setemployeeDepartment(departmentName);
        setemployeeDepartmentId(department_id);
        


      } catch (error) {
        console.error(error);
      }
    };
    fetchemployeeData();
  }, []);
  const handleLogout = () => {
    
    setemployeeName('');
    setemployeeId('');
    setemployeeDepartment('');
    setemployeeDepartmentId(null);
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
        <Text style={styles.subtitle}>{`Welcome, ${employeeName}`}</Text>

          <Text style={styles.title}>{`Tasks for  ${employeeDepartment}  Department`}</Text>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('Tasks', { employeeDepartmentId,employeeDepartment,employeeId })}
          >
            <Text style={styles.buttonText}>Add Task</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('Attendance',{employeeId,employeeDepartment})}
          >
            <Text style={styles.buttonText}>Add Attendance</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('Reports', { employeeDepartmentId,employeeDepartment,employeeId,employeeName })}
          >
            <Text style={styles.buttonText}>View Saved Tasks</Text>
          </Pressable>
          {/* Bouton de logout */}
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
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
    fontSize: 30,
    marginBottom: 10,
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 22,
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

export default HomeScreen;
