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
  const [Day, setDay] = useState('');
  const { employeeDepartmentId, employeeDepartment, employeeId,employeeName } = route.params;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Fetch tasks
        
        const tasksResponse = await api.get(`/tasks?collaborator_id=${employeeId}`);
        const today = new Date().toISOString().split('T')[0];
        setDay(today);

        const tasksWithDetails = await Promise.all(tasksResponse.data.map(async task => {
          const taskDefinitionResponse = await api.get(`/task_definitions?id=${task.task_definition_id}`);
          const equipmentData = task.equipment_data || [];
          const equipmentIds = equipmentData.map(e => e.equipment_id).filter(id => id !== undefined);

          const equipmentUsage = await Promise.all(equipmentIds.map(async (eid) => {
            try {
              const equipmentResponse = await api.get(`/equipment?id=${eid}`);
              return {
                name: equipmentResponse.data[0]?.name || 'Nom inconnu',
            id: equipmentResponse.data[0]?.id || 'ID inconnu',
                usageCount: equipmentData.find(e => e.equipment_id === eid).usage_count || 0 ,
              };
            } catch (error) {
              console.error(`Error fetching equipment with id ${eid}:`, error);
              return null;
            }
          })).then(results => results.filter(result => result !== null));

          return {
            ...task,
            taskDefinitionName: taskDefinitionResponse.data[0]?.name ?? 'Unknown Task',
            equipmentDetails: equipmentUsage,
          };
        }));

        // Filter tasks to only include those from today
        const filteredTasks = tasksWithDetails.filter(task => {
          const taskDate = new Date(task.date).toISOString().split('T')[0];
          return taskDate === today;
        });
        setTasks(filteredTasks);

        // Fetch attendance
        const attendanceResponse = await api.get(`/attendance?collaborator_id=${employeeId}`);
        const filteredAttendance = attendanceResponse.data.filter(record => {
          const attendanceDate = new Date(record.date).toISOString().split('T')[0];
          return attendanceDate === today;
        });
        setAttendance(filteredAttendance);
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
  const parseTime = (timeString) => {
    if (!timeString) return null;
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  };

  const formatTime = (timeString) => {
    const date = parseTime(timeString);
    return date ? date.toLocaleTimeString() : 'N/A';
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
            align: 'left';
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
          <h2 class="section-title">Présence de l'Employé</h2>
        ${attendance.map(record => `
          <div class="attendance">
            <p><strong>Date:</strong> ${new Date(record.date).toLocaleDateString()}</p>
            <p><strong>Statut:</strong> ${record.status}</p>
            
          </div>
        `).join('')}
          
          <h2 class="section-title">Tâches Effectuées</h2>
          ${tasks.map(task => `
            <div class="task">
              <p><strong>Client:</strong> ${task.client}</p>
              <p><strong>Lieu:</strong> ${task.location}</p>
              <p><strong>Type de Tâche:</strong> ${task.taskDefinitionName}</p>
              <p><strong>Heure:</strong> de ${formatTime(task.start_time )} à ${formatTime(task.end_time)}</p>
              <p><strong>Article utilisés:</strong> ${task.equipmentDetails.map(eq => `${eq.name} (Utilisation: ${eq.usageCount})`).join(', ')}</p>
            </div>
          `).join('')}
          
          <h2 class="section-title">Commentaires de l'Employé:</h2>
          <p>.......................................................................................................................................</p>
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
              <Text style={styles.title}>Rapport Quotidien</Text>
              <Text style={styles.subtitle}>Nom de l'Employé: {employeeName}</Text>
              <Text style={styles.subtitle}>Département: {employeeDepartment}</Text>
              <Text style={styles.subtitle}>Date: {Day}</Text>              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tâches:</Text>
              </View>
            </>
          }
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{`Type de tâche: ${item.taskDefinitionName}`}</Text>
              <Text>{`Client: ${item.client}`}</Text>
              <Text>{`Emplacement: ${item.location}`}</Text>
              <Text>{`Date: ${item.date ? new Date(item.date).toLocaleString() : 'N/A'}`}</Text>
              <Text>{`Heure de début: ${formatTime(item.start_time )}`}</Text>
              <Text>{`Heure de fin: ${formatTime(item.end_time )}`}</Text>
              <Text>{`Article utilisés: ${item.equipmentDetails.map(eq => `${eq.name} (Utilisation: ${eq.usageCount})`).join(', ')}`}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucune tâche trouvée pour aujourd'hui.</Text>}
          ListFooterComponent={
            <>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Présence:</Text>
              {attendance.map((att) => (
                <View key={att.id} style={styles.item}>
                  <Text style={styles.itemDetails}>Date: {att.date}</Text>
                  <Text style={styles.itemDetails}>Statut: {att.status}</Text>
                </View>
              ))}

            </View>
            <View style={styles.footer}>
            <View style={styles.buttonsContainer}>
              <Pressable style={styles.button} onPress={handleGeneratePDF}>
                <Text style={styles.buttonText}>Générer le PDF</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={handleSaveReport}>
                <Text style={styles.buttonText}>Enregistrer le Rapport</Text>
              </Pressable>
            </View>
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginTop: 16,
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
    color: '#eee',
    fontWeight: 'bold',

  },
overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: '100%',
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
    marginVertical: 20,
    color: "#FFF", // White text
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,

  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: "#FFF", 
    marginBottom: 10,
  },
  item: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 15,
    marginBottom: 8,
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#ddd',

  },
});

export default ReportsScreen;
