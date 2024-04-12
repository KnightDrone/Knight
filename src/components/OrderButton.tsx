import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import { buttonStyles } from "../types/ButtonStyles";
import { useFonts } from "expo-font";
import KaiseiRegular from "../../assets/fonts/KaiseiDecol-Regular.ttf";

interface ButtonProps {
  title: string;
  icon: ImageSourcePropType;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, icon, onPress }) => {
  const [fontsLoaded] = useFonts({
    "Kaisei-Regular": KaiseiRegular,
  });

  return (
    <TouchableOpacity style={buttonStyles.order_button} onPress={onPress}>
      <Image style={buttonStyles.image} source={icon} testID="image" />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontFamily: "Kaisei-Regular",
    lineHeight: 33,
    marginLeft: 20,
  },
});
