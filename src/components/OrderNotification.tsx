import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Order, OrderStatus } from "../types/Order"; // Adjust the import path as necessary
interface OrderNotificationProps {
  order: Order;
  onAccept: () => void;
  onReject: () => void;
}
const OrderNotification: React.FC<OrderNotificationProps> = ({
  order,
  onAccept,
  onReject,
}) => {
  const formatDate = (date: Date) => date.toLocaleDateString("en-US");
  return (
    <View className="ap-4 bg-white rounded-lg shadow-md m-4">
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
          onPress={onAccept}
          className="bg-green-500 px-4 py-2 rounded-full"
        >
          <Text className="text-white font-bold">Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onReject}
          className="bg-red-500 px-4 py-2 rounded-full"
        >
          <Text className="text-white font-bold">Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default OrderNotification;
