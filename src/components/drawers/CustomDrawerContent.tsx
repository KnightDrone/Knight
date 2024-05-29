import React, { useEffect } from "react";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Text, Image, Alert, Touchable } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FirestoreManager from "../../services/FirestoreManager";
import { auth } from "../../services/Firebase";
import { logoutUser } from "../../utils/Auth";
import { TouchableOpacity } from "react-native-gesture-handler";

export const CustomDrawerContent = ({
  name,
  email,
  photoURL,
  isOperator,
  ...props
}: any) => {
  return (
    <DrawerContentScrollView className=" " {...props}>
      <View className="flex flex-col items-center justify-center p-4">
        {photoURL ? (
          <Image
            source={{ uri: photoURL }}
            style={{
              marginBottom: 10,
              width: 50,
              height: 50,
              borderRadius: 25,
            }}
          />
        ) : (
          <Icon
            size={50}
            name="account"
            style={{ marginBottom: 10, borderRadius: 10 }}
          />
        )}
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{name}</Text>
        <Text style={{ color: "gray" }}>{email}</Text>

        {isOperator && (
          <View className="flex flex-row items-center justify-center p-2 bg-blue-800 mt-1 rounded-xl">
            <Text className="text-sm text-gray-500">Operator</Text>
          </View>
        )}
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};
