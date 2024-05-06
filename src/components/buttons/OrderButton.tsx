import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
  View,
} from "react-native";
import { buttonStyles } from "../../styles/ButtonStyles";

interface ButtonProps {
  title: string;
  icon: ImageSourcePropType;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity
      className="flex flex-row w-full"
      style={buttonStyles.order_button}
      onPress={onPress}
    >
      <View className="flex flex-row items-center w-full p-8">
        <Image style={buttonStyles.image} source={icon} testID="image" />
        <Text
          className="w-2/3"
          style={styles.text}
          numberOfLines={1}
          ellipsizeMode="clip"
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    lineHeight: 33,
    marginLeft: 10,
  },
});
