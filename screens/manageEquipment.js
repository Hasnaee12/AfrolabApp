import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet ,Pressable} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../api';

const ManageEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [equipmentName, setEquipmentName] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    const response = await api.get('/equipment');
    setEquipment(response.data);
  };

  const handleAddEquipment = async () => {
    await api.post('/equipment', { name: equipmentName });
    setEquipmentName('');
    fetchEquipment();
  };

  const handleDeleteEquipment = async (id) => {
    await api.delete(`/equipment/${id}`);
    fetchEquipment();
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
  
       <TextInput
        style={styles.input}
        placeholder="Equipment Name"
        value={equipmentName}
        onChangeText={setEquipmentName}
      />
      <Pressable style={styles.button} onPress={handleAddEquipment}>
            <Text style={styles.buttonText}> Add Equipment</Text>
        </Pressable>
      <FlatList
        data={equipment}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.equipmentItem}>
            <Text style={styles.text}>{item.name}</Text>
            <Button title="Delete" onPress={() => handleDeleteEquipment(item.id)} />
          </View>
        )}
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
        color: "#FFF", // White text
        fontWeight: "bold",
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  equipmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  text: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
    textAlign: 'center',
    lineHeight: 28,
    marginHorizontal: 20,
  },
});

export default ManageEquipment;
