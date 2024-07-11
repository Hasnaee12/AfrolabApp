
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import api from '../api';

const ReportScreen = ({ route }) => {
  const { department } = route.params;
  const [tasks, setTasks] = useState([]);
  const [reportSaved, setReportSaved] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [supervisorName, setSupervisorName] = useState('');
  const [employeeName, setemployeeName] = useState('');
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks', { params: { department } });
        setTasks(response.data);
        } catch (error) {
        console.error(error);
        Alert.alert('Error', 'An error occurred while fetching tasks');
      }
    };
    const fetchUserInfo = async () => {
      try {
        const response = await api.get('/user/info');
        setAdminName(response.data.adminName);
        setSupervisorName(response.data.supervisorName);
        setemployeeName(response.data.employeeName);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'An error occurred while fetching user info');
      }
    };

    fetchUserInfo();
    fetchTasks();
  }, [department]);

  const handleSaveReport = async () => {
    try {
      const report = {
        date: new Date(),
        tasks,
      };
      await api.post('/reports', report);
      setReportSaved(true);
      Alert.alert('Success', 'Report saved successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while saving the report');
    }
  };

  const handleGeneratePDF = async () => {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .title { text-align: center; font-size: 24px; margin-bottom: 20px; }
            .subtitle { font-size: 18px; margin-bottom: 10px; }
            .content { margin-bottom: 20px; }
            .footer { margin-top: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <img src="./assets/LOGO-AFROLAB-2.jpg" alt="Afrolab Logo" style="display: block; margin: 0 auto; width: 100px;">
          <h1 class="title">Daily Task Report</h1>
          <p class="subtitle">Date: ${new Date().toLocaleDateString()}</p>
          <p class="subtitle">Department: ${department}</p>
          <p class="subtitle">Admin: ${adminName}</p>
          <p class="subtitle">Supervisor: ${supervisorName}</p>
          <p class="subtitle">Nom: ${employeeName}</p>
          <hr>
          <h2 class="subtitle">Tasks Performed</h2>
          ${tasks.map(task => `
            <div class="content">
              <p>${task.description}</p>
              <p>Client: ${task.client}</p>
              <p>Location: ${task.location}</p>
              <p>Start Time: ${task.startTime}</p>
              <p>End Time: ${task.endTime}</p>
            </div>
          `).join('')}
          <h1 class="title">Attendance:</h1>
          <p class="subtitle">state of Attendance: ${department}</p>
          <div class="footer">
            <p>Validation by Supervisor:</p>
            <p>Name: ${supervisorName}</p>
            <p>Signature:  </p>
          </div>
        </body>
      </html>
    `;
    try {
      const { uri } = await Print.printToFileAsync({ html });
      await shareAsync(uri);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while generating the PDF');
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
          <Text style={styles.title}>Daily Reports</Text>
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <Text style={styles.taskText}>{item.description}</Text>
                <Text style={styles.taskText}>Client: {item.client}</Text>
                <Text style={styles.taskText}>Location: {item.location}</Text>
                <Text style={styles.taskText}>Start Time: {item.startTime}</Text>
                <Text style={styles.taskText}>End Time: {item.endTime}</Text>
              </View>
            )}
          />
          {!reportSaved && (
            <Pressable style={styles.button} onPress={handleSaveReport}>
              <Text style={styles.buttonText}>Save Report</Text>
            </Pressable>
          )}
          {reportSaved && <Text style={styles.successText}>Report saved successfully!</Text>}
          <Pressable style={styles.button} onPress={handleGeneratePDF}>
            <Text style={styles.buttonText}>Generate PDF</Text>
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
    color: '#FFF',
    fontWeight: 'bold',
  },
  taskItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  taskText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  successText: {
    fontSize: 16,
    color: '#00FF00',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ReportScreen;
