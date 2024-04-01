import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image, ImageSourcePropType } from "react-native";
import { buttonStyles } from "./ButtonStyles";
import { useFonts } from "expo-font";

interface ButtonProps {
    title: string;
    image: ImageSourcePropType;
    onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, image, onPress }) => {
    const [fontsLoaded] = useFonts({
        'Kaisei-Regular': require('../../assets/fonts/KaiseiDecol-Regular.ttf'),
      });

    if (!fontsLoaded) {
        return null;
    }
    
    return (
        <TouchableOpacity style={buttonStyles.order_button} onPress={onPress}>
            <Image  style={buttonStyles.image} source={image} />
            <Text style={{
                fontSize: 24,
                fontFamily: 'Kaisei-Regular',
                lineHeight: 33,
                marginLeft: 20,
            }}>{title}</Text>
        </TouchableOpacity>
    );
};


export default Button;
