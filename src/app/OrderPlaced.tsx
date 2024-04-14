import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import "./global.css";

const OrderPlaced = ({ navigation }: any) => {
  return (
    <View
      className="h-full p-4 justify-center items-center"
      testID="order-placed-screen"
    >
      <Text className="text-xl font-bold">Your order has been placed.</Text>
      <Text className="text-lg my-2">Arriving at 12:15</Text>
      <View className="my-2">
        <Text className="text-center">🚁</Text>
      </View>
      <View className="bg-gray-500 p-4 rounded-lg my-4">
        <Text className="text-lg font-semibold">Order summary</Text>
        <Text className="text-lg my-2">First aid kit</Text>
        <Text className="text-lg">Location: 46.5° N, 6.63° E</Text>
      </View>
      <Image
        className="w-full h-64 object-cover rounded-lg"
        source={{
          uri: "https://images.unsplash.com/photo-1606786322464-1e1e6e3c6f0e",
        }}
      />
      <TouchableOpacity className="mt-4">
        <Text className="text-blue-500">View order history</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderPlaced;
