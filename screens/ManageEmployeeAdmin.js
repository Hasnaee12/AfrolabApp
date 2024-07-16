import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, FlatList } from 'react-native';
import api from '../api';
import { LinearGradient } from 'expo-linear-gradient';

const ManageEmployeeAdmin = ({ route }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setphone_number] = useState('');
  const [role, setRole] = useState('');
  const [password, setpassword] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [department_id, setDepartment_id] = useState('');
  const [editingId, setEditingId] = useState(null);
 // const { userDepartmentId } = route.params;
  useEffect(() => {
    fetchCollaborators();
  }, []);

  const fetchCollaborators = async () => {
    try {
      const response = await api.get(`/collaborators?role=employee`);
      setCollaborators(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch collaborators');
    }
  };

  const handleAddOrUpdateEmployee = async () => {
    try {
      const collaboratorData = { name, email, password, phone_number, role: 'employee', department_id};
      console.log('Sending data:', collaboratorData);
      if (editingId) {
        await api.put(`/collaborators/${editingId}`, collaboratorData);
        Alert.alert('Success', 'Employee updated successfully');
      } else {
        await api.post('/collaborators', collaboratorData);
        Alert.alert('Success', 'Employee added successfully');
      }

      setName('');
      setEmail('');
      setpassword('');
      setphone_number('');
      setDepartment_id('');
      setEditingId(null);
      fetchCollaborators();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', editingId ? 'Failed to update employee' : 'Failed to add employee');
    }
  };

  const handleEdit = (collaborator) => {
    setName(collaborator.name);
    setEmail(collaborator.email);
    setpassword(collaborator.password); 
    setphone_number(collaborator.phone_number);
    setDepartment_id(collaborator.department_id);
    setEditingId(collaborator.id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/collaborators/${id}`);
      Alert.alert('Success', 'Employee deleted successfully');
      fetchCollaborators();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete employee');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Pressable style={styles.editButton} onPress={() => handleEdit(item)}>
        <Text style={styles.buttonText}>Edit</Text>
      </Pressable>
      <Pressable style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
        <Text style={styles.buttonText}>Delete</Text>
      </Pressable>
    </View>
  );

  return (
    <LinearGradient
      colors={['#FF8C04', '#0BECFB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Manage Employees</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
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
            onChangeText={setpassword} 
          />
          <TextInput
            style={styles.input}
            placeholder="phone number"
            value={phone_number}
            onChangeText={setphone_number}
          />
          <TextInput
            style={styles.input}
            placeholder="department ID"
            value={department_id}
            onChangeText={setDepartment_id}
          />
          <Pressable style={styles.button} onPress={handleAddOrUpdateEmployee}>
            <Text style={styles.buttonText}>{editingId ? 'Update Employee' : 'Add Employee'}</Text>
          </Pressable>
          <FlatList
            data={collaborators}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
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
  input: {
    width: '80%',
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    backgroundColor: '#FFD700',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  list: {
    width: '100%',
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '80%',
    alignSelf: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  editButton: {
    backgroundColor: '#FFD700',
    borderRadius: 5,
    padding: 10,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    borderRadius: 5,
    padding: 10,
  },
});

export default ManageEmployeeAdmin;
