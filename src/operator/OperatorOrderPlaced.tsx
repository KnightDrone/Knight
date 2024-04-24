import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Order } from "../types/Order"; // Adjust the import path as necessary
type Props = {
  order: Order;
  navigation: StackNavigationProp<any>;
};
const OrderOrderPlaced: React.FC<Props> = ({ order, navigation }) => {
  const [countdown, setCountdown] = useState<number>(10); // 10 seconds countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((currentCountdown) => currentCountdown - 1);
      }, 1000);
    } else if (countdown === 0 && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown]);
  const handleAccept = () => {
    if (countdown === 0) {
      navigation.navigate("OperatorOrderStarted");
    }
  };
  const handleReject = () => {
    navigation.navigate("OperatorMap");
  };
  const formatDate = (date: Date) => date.toLocaleDateString("en-US");
  return (
    <View>
      {/* Existing UI code */}
      <Text className="text-lg font-bold text-center mb-2">
        Order Notification
      </Text>
      <Text className="text-md text-center mb-1">
        Item: {order.getItem().name}
      </Text>
      <Text className="text-md text-center mb-1">
        Status: {order.getStatus()}
      </Text>
      <Text className="text-md text-center mb-1">
        Order Date: {formatDate(order.getOrderDate())}
      </Text>
      <Text className="text-md text-center mb-4">
        Delivery Date: {formatDate(order.getDeliveryDate())}
      </Text>
      <View className="flex-row justify-around">
        <TouchableOpacity
          onPress={handleAccept}
          disabled={countdown > 0}
          className="bg-green-500 px-4 py-2 rounded-full"
        >
          <Text className="text-white font-bold">
            {countdown > 0 ? `Accept in ${countdown}s` : "Accept"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleReject}
          className="bg-red-500 px-4 py-2 rounded-full"
        >
          <Text className="text-white font-bold">Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default OrderOrderPlaced;
