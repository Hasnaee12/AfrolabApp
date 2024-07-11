import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Switch } from 'react-native';

const tasksByDepartment = {
  Technique: [
    { description: 'Nombre d\'étalonnages', type: 'counter' },
    { description: 'Nombre de réparations', type: 'counter' },
    { description: 'Nombre d\'installations', type: 'counter' },
    { description: 'Nombre de livraisons', type: 'counter' },
    { description: 'Formations', type: 'switch' }
  ],
  Commercial: [
    { description: 'Nombre de visites commerciales', type: 'counter' },
    { description: 'Montant de commandes', type: 'counter' },
    { description: 'Montant de ventes/livraisons', type: 'counter' }
  ],
  Financier: [
    { description: 'Montant de recouvrement', type: 'counter' }
  ],
};

const TaskList = ({ department, tasks, setTasks }) => {
  const [taskList, setTaskList] = useState(tasksByDepartment[department] || []);

  useEffect(() => {
    // Initialize tasks if not already initialized
    if (tasks.length === 0) {
      const initialTasks = tasksByDepartment[department].map(task => ({
        ...task,
        value: task.type === 'counter' ? 0 : false,
        descriptionDetail: ''
      }));
      setTasks(initialTasks);
    }
  }, [department, setTasks]);

  const handleCounterChange = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index].value = value;
    setTasks(newTasks);
  };

  const handleDescriptionChange = (index, description) => {
    const newTasks = [...tasks];
    newTasks[index].descriptionDetail = description;
    setTasks(newTasks);
  };

  const handleCheckboxChange = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index].value = value;
    setTasks(newTasks);
  };

  return (
    <View style={styles.taskList}>
      {taskList.map((task, index) => (
        <View key={index} style={styles.taskCard}>
          <View style={styles.taskDescriptionContainer}>
            <Text style={styles.taskDescription}>{task.description}</Text>
            <TextInput
              style={styles.inputDescription}
              placeholder="Description"
              value={tasks[index]?.descriptionDetail || ''}
              onChangeText={(text) => handleDescriptionChange(index, text)}
            />
          </View>
          {task.type === 'counter' ? (
            <TextInput
              style={styles.inputCounter}
              keyboardType='numeric'
              value={tasks[index]?.value ? tasks[index].value.toString() : ''}
              onChangeText={(text) => handleCounterChange(index, parseInt(text) || 0)}
            />
          ) : (
            <Switch
              value={tasks[index]?.value || false}
              onValueChange={(newValue) => handleCheckboxChange(index, newValue)}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  taskList: {
    width: '100%',
  },
  taskCard: {
    backgroundColor: '#FFF',
    padding: 11,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskDescriptionContainer: {
    flex: 1,
  },
  taskDescription: {
    fontSize: 18,
    color: "#000", // Black text
  },
  inputDescription: {
    marginTop: 8,
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    color: "#000", // Black text
  },
  inputCounter: {
    width: 50,
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center',
    color: "#000", // Black text
  },
});

export default TaskList;
