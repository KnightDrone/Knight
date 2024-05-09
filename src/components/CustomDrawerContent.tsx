import React, { useEffect } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Text, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export const CustomDrawerContent = ({
  name,
  email,
  photoURL,
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
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};
