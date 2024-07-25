import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Pressable, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import api from '../api'; // Ensure you have the API endpoints set up

const ReportSelectionScreen = ({ navigation }) => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [employeeName, setemployeeName] = useState('');
  const [employeeDepartment, setemployeeDepartment] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get('/departments');
        setDepartments(response.data);
        const department = response.data.find(department => department.id === selectedDepartment);
          setemployeeDepartment(department?.name || 'Unknown ')
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      const fetchEmployees = async () => {
        try {
          const response = await api.get(`/collaborators?department_id=${selectedDepartment}`);
          const filteredEmployees = response.data.filter(employee => employee.role !== 'superuser');
          setEmployees(filteredEmployees);
          const employee = response.data.find(employee => employee.id === selectedEmployee);
          setemployeeName(employee?.name || 'Unknown employee')
          
          
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      };

      fetchEmployees();
    }
  }, [selectedDepartment]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleViewReport = () => {
    if (selectedEmployee && selectedDepartment) {
      navigation.navigate('ReportDetailsScreen', { employeeId: selectedEmployee,departmentID:selectedDepartment,employeeName, employeeDepartment,date });
    } else {
      Alert.alert('Error', 'Please select a department and an employee');
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
          <Text style={styles.title}>{`Choisir les critères du Rapport`}</Text>
            <Text style={styles.label}>Choisir le Département:</Text>
            <Picker
              selectedValue={selectedDepartment}
              onValueChange={(itemValue) => setSelectedDepartment(itemValue)}
              style={styles.pickerContainer}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Select a department" value={null} />
              {departments.map((department) => (
                <Picker.Item key={department.id} label={department.name} value={department.id} />
              ))}
            </Picker>
            <Text style={styles.label}>Choisir l'Employé:</Text>
            <Picker
              selectedValue={selectedEmployee}
              onValueChange={(itemValue) => setSelectedEmployee(itemValue)}
              style={styles.pickerContainer}
              itemStyle={styles.pickerItem}            >
              <Picker.Item label="Select an employee" value={null} />
              {employees.map((employee) => (
                <Picker.Item key={employee.id} label={employee.name} value={employee.id} />
              ))}
            </Picker>
          <View style={styles.datePickerContainer}>
            <Text style={styles.label}>Choisir la Date:</Text>
            <Pressable onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}
          </View>
          <Pressable style={styles.button} onPress={handleViewReport}>
              <Text style={styles.buttonText}>Voir le Rapport</Text>
            </Pressable>
          </View>
        </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 28,
    marginBottom: 50,
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
  },
  pickerContainer: {
    height: 50,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#aaa',
    marginBottom: 20,
  },
  pickerItem: {
    fontSize: 16,
  },
  label: {
    fontSize: 18,
    color: "#111",
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'left',

  },
  
  datePickerContainer: {
    width: '100%',
    marginVertical: 10,
  },
  dateText: {
    fontSize: 18,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    textAlign: 'center',

    
    
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
  buttonsContainer: {
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
});

export default ReportSelectionScreen;
