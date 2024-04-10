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

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    width: "80%",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "white",
    padding: 10,
  },
  text: {
    color: "black",
    textAlign: "center",
  },
});

export default Button;
