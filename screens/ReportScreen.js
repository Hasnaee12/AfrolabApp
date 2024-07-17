// screens/ReportsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import api from '../api';

const ReportsScreen = ({ route }) => {
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const {  employeeDepartmentId,employeeDepartment,employeeId } = route.params;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Fetch tasks
        const tasksResponse = await api.get(`/tasks?collaborator_id=${employeeId}`);
        setTasks(tasksResponse.data);

        // Fetch attendance
        const attendanceResponse = await api.get(`/attendance?collaborator_id=${employeeId}`);
        setAttendance(attendanceResponse.data);

        // Fetch employee details
        const employeeResponse = await api.get(`/collaborators?id=${employeeId}`);
        setEmployeeName(employeeResponse.data.name);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  // Fetch task definition details by ID
  const fetchTaskDefinition = async (taskDefinitionId) => {
    try {
      const response = await api.get(`/task_definitions?id=${taskDefinitionId}`);
      return response.data.name; 
    } catch (error) {
      console.error(`Error fetching task definition ${taskDefinitionId} details:`, error);
      return 'Unknown Task';
    }
  };

  // Fetch equipment details by ID
  const fetchEquipmentName = async (equipmentId) => {
    try {
      const response = await api.get(`/equipment?id=${equipmentId}`);
      return response.data.name; 
    } catch (error) {
      console.error(`Error fetching equipment ${equipmentId} details:`, error);
      return 'Unknown Equipment';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports for {employeeName} - {employeeDepartment}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tasks:</Text>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={async ({ item }) => {
            const taskDefinitionName = await fetchTaskDefinition(item.task_definition_id);
            const equipmentNames = await Promise.all(
              item.equipment_ids.map(async (eid) => await fetchEquipmentName(eid))
            );

            return (
              <View style={styles.item}>
                <Text>{`Task Type: ${taskDefinitionName}`}</Text>
                <Text>{`Client: ${item.client}`}</Text>
                <Text>{`Location: ${item.location}`}</Text>
                <Text>{`Start Time: ${new Date(item.start_time).toLocaleString()}`}</Text>
                <Text>{`End Time: ${new Date(item.end_time).toLocaleString()}`}</Text>
                <Text>{`Equipment: ${equipmentNames.join(', ')}`}</Text>
              </View>
            );
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attendance:</Text>
        <FlatList
          data={attendance}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{`Attendance ID: ${item.id}`}</Text>
              <Text>{`Status: ${item.status}`}</Text>
              <Text>{`Date: ${new Date(item.date).toLocaleDateString()}`}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  item: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
});

export default ReportsScreen;
