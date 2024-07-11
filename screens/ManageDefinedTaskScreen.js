import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Button, FlatList } from 'react-native';
import api from '../api';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';

const ManageDefinedTaskScreen = ({ route }) => {
  const [taskDefinitions, setTaskDefinitions] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', department_id: '' });
  const [departments, setDepartments] = useState([]);
  const [superuserDepartment, setSuperuserDepartment] = useState(null);
  const { userDepartmentId } = route.params; // Get userdepartmentId from route params

  useEffect(() => {
    setSuperuserDepartment(userDepartmentId);
    fetchTaskDefinitions(userDepartmentId);
    fetchDepartments();
  }, [route.params]);

  const fetchTaskDefinitions = async () => {
    try {
      if (userDepartmentId) {
        const response = await api.get(`/task_definitions?department_id=${userDepartmentId}`);
        setTaskDefinitions(response.data);
      } else {
        Alert.alert('Error', 'Department ID is not defined');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch task definitions');
    }
  };
  

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTask = async () => {
    try {
      await api.post('/task_definitions', newTask);
      Alert.alert('Success', 'Task Definition added successfully');
      setNewTask({ name: '', department_id: '' });
      fetchTaskDefinitions(superuserDepartment);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add task definition');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/task_definitions/${id}`);
      fetchTaskDefinitions(superuserDepartment);
    } catch (error) {
      console.error(error);
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
          <Text style={styles.title}>Manage Defined Tasks</Text>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Task Name"
              value={newTask.name}
              onChangeText={(text) => setNewTask({ ...newTask, name: text, department_id: superuserDepartment })}
            />
            <Pressable style={styles.button} onPress={handleAddTask}>
              <Text style={styles.buttonText}>Add Task</Text>
            </Pressable>
          </View>
          <Text style={styles.subtitle}>Tasks list:</Text>
          <FlatList
            data={taskDefinitions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <Text>{item.name}</Text>
                <Button title="Delete" onPress={() => handleDeleteTask(item.id)} />
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
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    color: "#FFF",
    fontWeight: "bold",
  },
  formContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    width: '70%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  button: {
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#FFD700',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});

export default ManageDefinedTaskScreen;
