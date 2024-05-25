import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function HeaderBackButton({ onPress, testID }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="p-2 items-center justify-center"
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel="Back to previous screen"
    >
      <Icon name="menu" size={24} color="#000" />
    </TouchableOpacity>
  );
}
