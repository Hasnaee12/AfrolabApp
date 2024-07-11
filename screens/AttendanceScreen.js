import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

const AttendanceScreen = ({ navigation }) => {
  const [status, setStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddAttendance = async () => {
    try {
      const response = await api.post('/attendance', { status, date: selectedDate });
      if (response.data.message === 'Attendance added successfully') {
        Alert.alert('Success', 'Attendance added successfully');
        setStatus('');
        setSelectedDate(new Date()); // Réinitialise la date sélectionnée
        navigation.navigate('Reports', { selectedDate }); // Passe la date sélectionnée à la page Reports
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
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
          <Text style={styles.title}>Record Attendance</Text>
          <Pressable onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateLabel}>
              Selected Date: {selectedDate.toLocaleDateString()}
            </Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
            />
          )}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={status}
              onValueChange={(itemValue, itemIndex) => setStatus(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Status" value="" />
              <Picker.Item label="Present" value="Present" />
              <Picker.Item label="Absent" value="Absent" />
            </Picker>
          </View>
          <Pressable style={styles.button} onPress={handleAddAttendance}>
            <Text style={styles.buttonText}>Add Attendance</Text>
          </Pressable>
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
  title: {
    fontSize: 33,
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFF', // White text
    fontWeight: 'bold',
  },
  dateLabel: {
    fontSize: 18,
    marginBottom: 10,
    color: '#FFF', // White text
    textAlign: 'center',
  },
  pickerContainer: {
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  picker: {
    height: 40,
    color: '#000', // Black text
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
    fontSize: 23,
    fontWeight: 'bold',
  },
});

export default AttendanceScreen;
