import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import api from '../api';

const TaskScreen = ({ route, navigation }) => {
  // State variables
  const { employeeDepartmentId, employeeDepartment, employeeId } = route.params;
  const [taskDefinitions, setTaskDefinitions] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [client, setClient] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [selectedTaskDefinition, setSelectedTaskDefinition] = useState('');
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskResponse = await api.get(`/task_definitions?department_id=${employeeDepartmentId}`);
        setTaskDefinitions(taskResponse.data);

        if (employeeDepartmentId === 1) {
          const equipmentResponse = await api.get('/equipment');
          setEquipments(equipmentResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to fetch data');
      }
    };
    fetchData();
  }, [employeeDepartmentId]);

  // Handle saving tasks
  const handleSaveTasks = async () => {
    try {
      const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      };
      // Debugging: Log formatted times
      console.log("Formatted start time:", formatTime(startTime));
      console.log("Formatted end time:", formatTime(endTime));

      const task = {
        task_definition_id: selectedTaskDefinition,
        equipment_ids: employeeDepartmentId === 1 & selectedEquipments,
        client,
        location,
        start_time: formatTime(startTime),
        end_time: formatTime(endTime),
        collaborator_id: employeeId,
      };

      const response = await api.post('/tasks', {
        department_id: employeeDepartmentId,
        task,
      });

      if (response.data.message === 'Task created successfully') {
        Alert.alert('Success', 'Task saved successfully');
        setSelectedTaskDefinition('');
        setSelectedEquipments([]);
        setClient('');
        setLocation('');
        setStartTime(new Date());
        setEndTime(new Date());
        navigation.navigate('Reports',{employeeDepartmentId, employeeDepartment, employeeId});
      }
    } catch (error) {
      console.error('Error saving tasks:', error);
      Alert.alert('Error', 'An error occurred while saving tasks');
    }
  };

  const handleSelectEquipment = (equipmentId) => {
    if (selectedEquipments.includes(equipmentId)) {
      setSelectedEquipments(selectedEquipments.filter(id => id !== equipmentId));
    } else {
      setSelectedEquipments([...selectedEquipments, equipmentId]);
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
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>Add Tasks for {employeeDepartment} Department</Text>
            <View
              style={{
                marginTop: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderRadius: 10,
              }}
            >
              <Text style={styles.label}>Task Type</Text>
              <Picker
                selectedValue={selectedTaskDefinition}
                onValueChange={(itemValue) => setSelectedTaskDefinition(itemValue)}
                style={styles.pickerContainer}
                itemStyle={styles.pickerItem}
              >
                {taskDefinitions.map((task) => (
                  <Picker.Item key={task.id} label={task.name} value={task.id} />
                ))}
              </Picker>
              {employeeDepartmentId === 1 && (
                <>
                  <Text style={styles.label}>Equipment</Text>
                  {equipments.map((equipment) => (
                    <Pressable
                      key={equipment.id}
                      style={[
                        styles.equipmentItem,
                        selectedEquipments.includes(equipment.id) && styles.selectedEquipment,
                      ]}
                      onPress={() => handleSelectEquipment(equipment.id)}
                    >
                      <Text style={styles.equipmentText}>{equipment.name}</Text>
                    </Pressable>
                  ))}
                </>
              )}
              <View style={styles.taskDescriptionContainer}>
                <Text style={styles.label}>Client</Text>
                <TextInput
                  style={styles.inputDescription}
                  placeholder="Client"
                  value={client}
                  onChangeText={setClient}
                />
              </View>
              <View style={styles.taskDescriptionContainer}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.inputDescription}
                  placeholder="Location"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
              <Text style={styles.label}>Start Time</Text>
              <Pressable onPress={() => setShowStartTimePicker(true)}>
                <Text style={styles.inputDescription}>{startTime.toLocaleTimeString()}</Text>
              </Pressable>
              {showStartTimePicker && (
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowStartTimePicker(false);
                    setStartTime(selectedDate || startTime);
                  }}
                />
              )}
              <Text style={styles.label}>End Time</Text>
              <Pressable onPress={() => setShowEndTimePicker(true)}>
                <Text style={styles.inputDescription}>{endTime.toLocaleTimeString()}</Text>
              </Pressable>
              {showEndTimePicker && (
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowEndTimePicker(false);
                    setEndTime(selectedDate || endTime);
                  }}
                />
              )}
            </View>
            <Pressable style={styles.button} onPress={handleSaveTasks}>
              <Text style={styles.buttonText}>Save Tasks</Text>
            </Pressable>
          </ScrollView>
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
    padding: 16,
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 2,
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
  },
  pickerContainer: {
    height: 50,
    width: '100%',
    marginBottom: 2,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    paddingLeft: 8,
    paddingRight: 8,
    color: '#000',
  },
  pickerItem: {
    fontSize: 16,
    color: '#000',
  },
  equipmentItem: {
    marginTop: 8,
    padding: 10,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  selectedEquipment: {
    backgroundColor: '#FFD700',
  },
  equipmentText: {
    color: '#000',
  },
  inputDescription: {
    marginTop: 8,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    color: '#000',
  },
  taskDescriptionContainer: {
    marginTop: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  button: {
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFD700',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TaskScreen;
