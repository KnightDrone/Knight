import React from "react";
import {
  TouchableOpacity,
  Text,
  Image,
  ImageSourcePropType,
  View,
} from "react-native";

interface ButtonProps {
  title: string;
  icon: ImageSourcePropType;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity
      className="flex flex-row items-center w-4/5 bg-figma-yellow rounded-lg mb-8"
      onPress={onPress}
    >
      <View className="flex flex-row items-center w-full p-8">
        <Image className="h-9 w-9 px-0.5" source={icon} testID="image" />
        <Text
          className="text-black text-center w-2/3 text-2xl leading-8 ml-2.5"
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
