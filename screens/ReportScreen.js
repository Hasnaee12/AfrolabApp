import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable,Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import api from '../api';

const ReportsScreen = ({ route }) => {
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [adminName, setAdminName] = useState('');
  const [supervisorName, setSupervisorName] = useState('');
  const { employeeDepartmentId, employeeDepartment, employeeId,employeeName } = route.params;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Fetch tasks
        const tasksResponse = await api.get(`/tasks?collaborator_id=${employeeId}`);
        const tasksWithDetails = await Promise.all(tasksResponse.data.map(async task => {
          const taskDefinitionResponse = await api.get(`/task_definitions?id=${task.task_definition_id}`);
          const equipmentNames = await Promise.all(task.equipment_ids.map(async eid => {
            const equipmentResponse = await api.get(`/equipment?id=${eid}`);
            return equipmentResponse.data[0]?.name ?? 'Unknown Equipment';  // Handle empty response
          }));

          return {
            ...task,
            taskDefinitionName: taskDefinitionResponse.data[0]?.name ?? 'Unknown Task', // Handle empty response
            equipmentNames,
          };
        }));
        setTasks(tasksWithDetails);

        // Fetch attendance
        const attendanceResponse = await api.get(`/attendance?collaborator_id=${employeeId}`);
        setAttendance(attendanceResponse.data);

        // Fetch user info
        await fetchUserInfo();
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);
  const fetchUserInfo = async () => {
    try {
      const collaboratorsResponse = await api.get(`/collaborators?role=admin`);
      setAdminName(collaboratorsResponse.data[0]?.name || 'Unknown Admin');

      const supervisorsResponse = await api.get(`/collaborators?role=superuser`);
      const supervisor = supervisorsResponse.data.find(supervisor => supervisor.department_id === employeeDepartmentId);
      setSupervisorName(supervisor?.name || 'Unknown Supervisor');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while fetching user info');
    }
  };
  const handleGeneratePDF = async () => {
    const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: #f9f9f9;
          }
          .title {
            text-align: center;
            font-size: 28px;
            color: #444;
            margin-bottom: 20px;
          }
          .logo {
            display: block;
            margin: 0 auto 20px;
            width: 120px;
          }
          .subtitle {
            font-size: 20px;
            color: #555;
            margin-bottom: 10px;
          }
          .content {
            margin-bottom: 20px;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 18px;
            color: #666;
          }
          .section-title {
            font-size: 22px;
            color: #333;
            border-bottom: 2px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 15px;
          }
          .task, .attendance {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            background-color: #fff;
          }
          .task p, .attendance p {
            margin: 5px 0;
          }
          .signature {
            margin-top: 40px;
            text-align: left;
          }
          .signature p {
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="https://th.bing.com/th/id/R.11147171891cc31010c40d397a4d38a2?rik=x4zcSWOM4rLTQQ&riu=http%3a%2f%2fwww.afrolab.ma%2fwp-content%2fthemes%2ftheme%2fimg%2fafrolab.jpg&ehk=b%2bMAECMgGbdB5p0ZVR3j7HfQxExUM8DR1nGiJcqFVOk%3d&risl=&pid=ImgRaw&r=0" alt="Afrolab Logo" class="logo">
          <h1 class="title">Rapport Quotidien des Tâches</h1>
          <p class="subtitle">Date: ${new Date().toLocaleDateString()}</p>
          <p class="subtitle">Représentant d’administration (admin) : M. ${adminName}</p>
          <p class="subtitle">Nom de l'Employé: ${employeeName}</p>
          <p class="subtitle">Département: ${employeeDepartment}</p>
          <p class="subtitle">Responsable ${employeeDepartment}: M. ${supervisorName}</p>
          <hr>
          <h2 class="section-title">Tâches Effectuées</h2>
          ${tasks.map(task => `
            <div class="task">
              <p><strong>Type de Tâche:</strong> ${task.taskDefinitionName}</p>
              <p><strong>Client:</strong> ${task.client}</p>
              <p><strong>Lieu:</strong> ${task.location}</p>
              <p><strong>Heure:</strong> ${task.start_time ? new Date(task.start_time).toLocaleString() : 'N/A'} - ${task.end_time ? new Date(task.end_time).toLocaleString() : 'N/A'}</p>
              <p><strong>Équipements utilisés:</strong> ${task.equipmentNames.join(', ')}</p>
            </div>
          `).join('')}
          <h2 class="section-title">Commentaires de l'Employé:</h2>
          <p>.........................................................................................................................................................................................</p>
          <div class="footer">
            <h2 class="section-title">Validation du Responsable Technique:</h2>
            <div class="signature">
              <p>Nom: ${supervisorName}</p>
              <p>Signature:</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await shareAsync(uri);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'An error occurred while generating the PDF');
    }
  };
  const handleSaveReport = async () => {
    const report = {
      date: new Date(),
      tasks,
      attendance,
      collaborator_id: employeeId,
    };

    try {
      await api.post('/reports', report);
      Alert.alert('Success', 'Report saved successfully');
    } catch (error) {
      console.error('Error saving report:', error);
      Alert.alert('Error', 'An error occurred while saving the report');
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
      <FlatList
          ListHeaderComponent={
            <>
              <Text style={styles.title}>Reports for {employeeName} - {employeeDepartment} Department</Text>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tasks:</Text>
              </View>
            </>
          }
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{`Task Type: ${item.taskDefinitionName}`}</Text>
              <Text>{`Client: ${item.client}`}</Text>
              <Text>{`Location: ${item.location}`}</Text>
              <Text>{`Start Time: ${item.start_time ? new Date(item.start_time).toLocaleString() : 'N/A'}`}</Text>
              <Text>{`End Time: ${item.end_time ? new Date(item.end_time).toLocaleString() : 'N/A'}`}</Text>
              <Text>{`Equipment: ${item.equipmentNames.join(', ')}`}</Text>
            </View>
          )}
          ListFooterComponent={
            <>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Attendance:</Text>
              {attendance.map((att) => (
                <View key={att.id} style={styles.item}>
                  <Text style={styles.itemDetails}>Date: {att.date}</Text>
                  <Text style={styles.itemDetails}>Status: {att.status}</Text>
                </View>
              ))}
            </View>
            <Pressable style={styles.button} onPress={handleSaveReport}>
          <Text style={styles.buttonText}>Save Report</Text>
        </Pressable>
            <Pressable style={styles.button} onPress={handleGeneratePDF}>
            <Text style={styles.buttonText}>Generate PDF</Text>
          </Pressable>
          </>  
          }
        />
      </View>
    </LinearGradient>
    
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
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
overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  containers: {
    flex: 1,
    padding: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: "#FFF", // White text

    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: "#FFF", // White text
    marginBottom: 8,
  },
  item: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 2,
    backgroundColor: '#ddd',

  },
});

export default ReportsScreen;
