import React from 'react';
import OrderButton from '../components/OrderButton';
import {Text, StyleSheet, View} from 'react-native'
import { useFonts } from 'expo-font';


interface OrderProps {
    // Define your component props here
}

// Items available for order
enum Items {
    FIRST_AID = 'First Aid Kit',
    FLASHLIGHT = 'Flashlight',
    THERMAL = 'Thermal Blanket',
    POWER = 'Power Bank',
}

export default function Order() {
    // Load custom fonts
    const [fontsLoaded] = useFonts({
        'Kaisei-Regular': require('../../assets/fonts/KaiseiDecol-Regular.ttf'),
      });
    

    return (
        <View>
            <Text style={{
                fontSize: 36,
                marginBottom: 33,
                fontFamily: 'Kaisei-Regular',
                lineHeight: 40,
                alignSelf: 'center',
            }}>
                Place your Order
            </Text>
            <OrderButton 
                title="First Aid Kit" 
                image={require("../../assets/images/first_aid.png")} 
                onPress={() => console.log('First Aid Kit')} />
            <OrderButton 
                title="Thermal Blanket"
                image={require("../../assets/images/thermal_blanket.png")} 
                onPress={() => console.log('Thermal Blanket')} />
            <OrderButton 
                title="Flashlight" 
                image={require("../../assets/images/flashlight.png")}
                onPress={() => console.log('Flashlight')} />
            <OrderButton 
                title="Power Bank" 
                image={require("../../assets/images/powerbank.png")}
                onPress={() => console.log('Power Bank')} />
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
    
  });