import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, FlatList } from 'react-native';
import api from '../api';
import { LinearGradient } from 'expo-linear-gradient';

const ManageDepartmentResponsiblesScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setphone_number] = useState('');
  const [password, setpassword] = useState('');
  const [department_id, setDepartment_id] = useState('');
  const [responsibles, setResponsibles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchResponsibles();
  }, []);

  const fetchResponsibles = async () => {
    try {
      const response = await api.get('/collaborators?role=superuser');
      setResponsibles(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch department responsibles');
    }
  };

  const handleAddOrUpdateResponsible = async () => {
    try {
      const collaboratorData = { name, email, password, phone_number, role: 'superuser', department_id};
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
      fetchResponsibles();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', editingId ? 'Failed to update department responsible' : 'Failed to add department responsible');
    }
  };

  const handleEdit = (responsible) => {
    setName(responsible.name);
    setEmail(responsible.email);
    setpassword(responsible.password); 
    setphone_number(responsible.phone_number);
    setDepartment_id(responsible.department_id);
    setEditingId(responsible.id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/collaborators/${id}`);
      Alert.alert('Success', 'Department Responsible deleted successfully');
      fetchResponsibles();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete department responsible');
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
          <Text style={styles.title}>Manage Department Managers</Text>
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
          <Pressable style={styles.button} onPress={handleAddOrUpdateResponsible}>
            <Text style={styles.buttonText}>{editingId ? 'Update Responsible' : 'Add Responsible'}</Text>
          </Pressable>
          
          <FlatList
            data={responsibles}
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
    borderColor: 'gray',
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

export default ManageDepartmentResponsiblesScreen;
