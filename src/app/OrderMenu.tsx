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

export default function OrderMenu() {
    // Load custom fonts
    const [fontsLoaded] = useFonts({
        'Kaisei-Regular': require('../../assets/fonts/KaiseiDecol-Regular.ttf'),
      });
    

    return (
        <View style={styles.container}>
            <View style={styles.triangle}></View>
            <Text style={{
                fontSize: 36,
                marginBottom: 33,
                fontFamily: 'Kaisei-Regular',
                lineHeight: 40,
                alignSelf: 'center',
            }}>
                Choose your item
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
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 0,
        borderRightWidth: 460, // Width of the triangle
        borderBottomWidth: 750, // Height of the triangle
        borderLeftWidth: 0, // Width of the triangle
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#93D39D', // Color of the triangle
        borderLeftColor: 'transparent',
        position: 'absolute', // This ensures the triangle is in the background
        bottom: -123,
        left: -23,
      },
  });