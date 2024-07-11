// screens/DepartmentScreen.js
import React from 'react';
import { View, Text, Pressable, StyleSheet,Image,ImageBackground } from 'react-native';


const DepartmentScreen = ({ navigation,route }) => {
  const departments = ['Technique', 'Commercial', 'Financier'];
  //const { name} = route.params;
  
  return (
    <ImageBackground
      source={require('../assets/afrolabMan.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
      <View style={styles.container}>
        
          <View
            style={{
              marginTop: 0,
              alignItems: "center",
              gap: 0,
            }}
          >
                <Image
                    source={require('../assets/LOGO-AFROLAB-2.jpg')}
                    style={styles.Image}
                    resizeMode="contain" // Ensures the image maintains its aspect ratio

                />
              <View
                style={{
                  width: 10,
                  height: 20,
                  borderRadius: 25,
                  justifyContent: "center",
                }}
              >
              </View>
              <Text style={styles.title}>Choose Your Department</Text>
              
              
            
          </View>
          <View
            style={{
              marginTop: 20,
              backgroundColor: "white",
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              
            }}
          >
                {departments.map((dept, index) => (
                    <Pressable
                    key={index}
                    style={({ pressed }) => [
                        styles.button,
                        { backgroundColor: pressed ? "#FFC107" : "#FFD700" }
                    ]}
                    onPress={() => navigation.navigate('Home', { department: dept })}
                    >
                    <Text style={styles.buttonText}>{dept}</Text>
                    </Pressable>
                ))}


            
            
          </View>
     </View>    
      
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 50% transparent black
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    width: 350,
  },
  title: {
    fontSize: 33,
    marginBottom: 100,
    textAlign: 'center',
    color: "#FFF", // Black text
      fontWeight: "bold",
  },
  Image: {
    width: 200, // Width of the image
    height: 100, // Height of the image
    alignContent: "center",
    resizeMode: 'contain', // Maintain aspect ratio

  },
  buttonContent: {
    flexDirection: 'row', // Arrange items horizontally
    alignItems: 'center', // Center items vertically
  },
    button: {
      borderRadius: 20,
      padding: 15, // Increased padding for a larger button
      marginVertical: 10, // Space between each button
      alignItems: "center",
    },
    buttonText: {
      color: "#000", // Black text
      fontSize: 18, // Larger text size
      fontWeight: "bold",
    },
});

export default DepartmentScreen;
