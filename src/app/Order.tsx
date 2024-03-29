import React from 'react';
import OrderButton from '../components/OrderButton';
import {Text, StyleSheet, View} from 'react-native'
import { useFonts } from 'expo-font';
import { buttonStyles } from '../components/ButtonStyles';

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
    // Load custom fonts
    const [fontsLoaded] = useFonts({
        'Kaisei-Regular': require('../../assets/fonts/KaiseiDecol-Regular.ttf'),
        'Kaisei-Medium': require('../../assets/fonts/KaiseiDecol-Medium.ttf'),
        'Kaisei-Bold': require('../../assets/fonts/KaiseiDecol-Bold.ttf'),
    });

    return (
        <View>
            <Text style={styles.title}>Place your Order</Text>
            <OrderButton title="First Aid Kit" onPress={() => console.log('First Aid Kit')} />
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
      fontFamily: 'Kaisei-Regular',
      lineHeight: 40,
    },  
  });