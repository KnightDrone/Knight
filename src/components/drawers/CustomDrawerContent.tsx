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
          <Text
            className="text-sm text-white rounded-xl p-1 bg-blue-800 mt-1"
            style={{ color: "gray" }}
          >
            Operator
          </Text>
        )}
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};
