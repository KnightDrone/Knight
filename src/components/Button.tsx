import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { buttonStyles } from "./ButtonStyles";

interface ButtonProps {
  title: string;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={buttonStyles.default_button} onPress={onPress}>
      <Text style={buttonStyles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
