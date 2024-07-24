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
  const [usageCounts, setUsageCounts] = useState({});
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [taskDate, setTaskDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      const equipmentData = selectedEquipments.map(equipmentId => ({
        equipment_id: equipmentId,
        usage_count: usageCounts[equipmentId] || 1,
      }));

      const task = {
        task_definition_id: selectedTaskDefinition,
        equipment_data: employeeDepartmentId === 1 ? equipmentData : [],
        client,
        location,
        start_time: formatTime(startTime),
        end_time: formatTime(endTime),
        collaborator_id: employeeId,
        date: formatDate(taskDate),
      };

      const response = await api.post('/tasks', {
        department_id: employeeDepartmentId,
        task,
      });

      if (response.data.message === 'Task created successfully') {
        Alert.alert('Success', 'Task saved successfully');
        setSelectedTaskDefinition('');
        setSelectedEquipments([]);
        setUsageCounts({});
        setClient('');
        setLocation('');
        setStartTime(new Date());
        setEndTime(new Date());
        setTaskDate(new Date());
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
      const newUsageCounts = { ...usageCounts };
      delete newUsageCounts[equipmentId];
    } else {
      setSelectedEquipments([...selectedEquipments, equipmentId]);
    }
  };
  const handleUsageCountChange = (equipmentId, count) => {
    setUsageCounts({ ...usageCounts, [equipmentId]: count });
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
            <Text style={styles.title}>Ajouter les taches pour le département {employeeDepartment} </Text>
            <View
              style={{
                marginTop: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderRadius: 10,
              }}
            >
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
                <Text style={styles.label}>Emplacement</Text>
                <TextInput
                  style={styles.inputDescription}
                  placeholder="Location"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
              
              <Text style={styles.label}>Type de tâche</Text>
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
                  <Text style={styles.label}>Articles</Text>
                  <Picker
                    selectedValue={selectedEquipments[0]}
                    onValueChange={(itemValue) => handleSelectEquipment(itemValue)}
                    style={styles.pickerContainer}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="Select Equipment" value="" />
                    {equipments.map((equipment) => (
                      <Picker.Item key={equipment.id} label={equipment.name} value={equipment.id} />
                    ))}
                  </Picker>
                  {selectedEquipments.map(equipmentId => (
                    <View key={equipmentId} style={styles.equipmentContainer}>
                      <Text style={styles.equipmentText}>{equipments.find(e => e.id === equipmentId)?.name}</Text>
                      <TextInput
                        style={styles.usageInput}
                        placeholder="Usage Count"
                        keyboardType="numeric"
                        value={usageCounts[equipmentId]?.toString() || ''}
                        onChangeText={(value) => handleUsageCountChange(equipmentId, parseInt(value, 10))}
                      />
                    </View>
                  ))}
                </>
              )}
              <Text style={styles.label}>Date de la tâche</Text>
              <Pressable onPress={() => setShowDatePicker(true)}>
                <Text style={styles.inputDescription}>{taskDate.toLocaleDateString()}</Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={taskDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    setTaskDate(selectedDate || taskDate);
                  }}
                />
              )}
              <Text style={styles.label}>Heure de début</Text>
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
              <Text style={styles.label}>Heure de fin</Text>
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
              <Text style={styles.buttonText}>Enregistrer la tache</Text>
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
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
  },
  pickerItem: {
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputDescription: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
  },
  taskDescriptionContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  equipmentItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    marginBottom: 10,
    backgroundColor: 'white',
  },equipmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  equipmentText: {
    flex: 1,
    fontSize: 18,
    color: 'black',
  },
  usageInput: {
    width: 100,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: 'white',
    marginLeft: 10,
  },
});

export default TaskScreen;
