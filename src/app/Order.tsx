import React from 'react';
import Button from '../components/Button';
import {Text, StyleSheet, View} from 'react-native'

interface OrderProps {
    // Define your component props here
}

// Items available for order
enum Item {
    FIRST_AID = 'First Aid Kit',
    FLASHLIGHT = 'Flashlight',
    THERMAL = 'Thermal Blanket',
    POWER = 'Power Bank',
}

export default function Order() {
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choose your Item</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 36,
      marginBottom: 33,
      fontFamily: 'Kaisei-Decol',
    },
    input: {
      width: '80%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      padding: 10,
    },
    error: {
      color: 'red',
      marginTop: 10,
    },
  
    text: {
      color: 'black',
      fontSize: 16,
    }
  
  });