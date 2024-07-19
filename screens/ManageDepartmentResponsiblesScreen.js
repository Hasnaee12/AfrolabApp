import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, FlatList } from 'react-native';
import api from '../api';
import { LinearGradient } from 'expo-linear-gradient';

const ManageDepartmentResponsiblesScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setphone_number] = useState('');
  const [password, setpassword] = useState('');
  const [department_id, setDepartment_id] = useState('');
  const [responsibles, setResponsibles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchResponsibles();
  }, []);

  const fetchResponsibles = async () => {
    try {
      const response = await api.get('/collaborators?role=superuser');
      setResponsibles(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Échec de la récupération des responsables de département');
    }
  };

  const handleAddOrUpdateResponsible = async () => {
    try {
      const collaboratorData = { name, email, password, phone_number, role: 'superuser', department_id};
      console.log('Sending data:', collaboratorData);
      if (editingId) {
        await api.put(`/collaborators/${editingId}`, collaboratorData);
        Alert.alert('Succès', 'Employé mis à jour avec succès');
      } else {
        await api.post('/collaborators', collaboratorData);
        Alert.alert('Succès', 'Employé ajouté avec succès');
      }

      setName('');
      setEmail('');
      setpassword('');
      setphone_number('');
      setDepartment_id('');
      setEditingId(null);
      fetchResponsibles();
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', editingId ? 'Échec de la mise à jour du responsable de département' : 'Échec de l\'ajout du responsable de département');
    }
  };

  const handleEdit = (responsible) => {
    setName(responsible.name);
    setEmail(responsible.email);
    setpassword(responsible.password); 
    setphone_number(responsible.phone_number);
    setDepartment_id(responsible.department_id);
    setEditingId(responsible.id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/collaborators/${id}`);
      Alert.alert('Succès', 'Responsable de département supprimé avec succès');
      fetchResponsibles();
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Échec de la suppression du responsable de département');
    }
  };

  const confirmDelete = (id) => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer ce responsable?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          onPress: () => handleDelete(id)
        }
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Pressable style={styles.editButton} onPress={() => handleEdit(item)}>
        <Text style={styles.buttonText}>Modifier</Text>
      </Pressable>
      <Pressable style={styles.deleteButton} onPress={() => confirmDelete(item.id)}>
        <Text style={styles.buttonText}>Supprimer</Text>
      </Pressable>
    </View>
  );

  return (
    <LinearGradient
      colors={['#FF8C04', '#0BECFB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Gérer les chefs de département</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setpassword} 
          />
          <TextInput
            style={styles.input}
            placeholder="Téléphone "
            value={phone_number}
            onChangeText={setphone_number}
          />
          <TextInput
            style={styles.input}
            placeholder="ID de département"
            value={department_id}
            onChangeText={setDepartment_id}
          />
          <Pressable style={styles.button} onPress={handleAddOrUpdateResponsible}>
            <Text style={styles.buttonText}>{editingId ? 'Modifier chef de département' : 'Ajouter chef de département'}</Text>
          </Pressable>
          
          <FlatList
            data={responsibles}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
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
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFF', // White text
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    backgroundColor: '#FFD700',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  list: {
    width: '100%',
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
    alignSelf: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  editButton: {
    backgroundColor: '#FFD700',
    borderRadius: 5,
    padding: 10,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    borderRadius: 5,
    padding: 10,
  },
});

export default ManageDepartmentResponsiblesScreen;
