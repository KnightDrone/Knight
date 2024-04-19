import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Order } from "../types/Order";

const formatDate = (date: Date) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${monthNames[monthIndex]} ${day}, ${year}`;
};

// TODO: Add onClick functionality to the card + update the styles

const OrderCard = ({ order }: { order: Order }) => {
  const item = order.getItem();
  // The parameters that we actually care to display in card
  const name = item.getName();
  const orderDate = order.getOrderDate();
  const price = item.getPrice();
  const locName = order.getOpName();
  return (
    <View className="bg-white flex-1 rounded-lg shadow-md m-2 flex-row p-2 border-2 border-gray-300">
      <View className="flex-1">
        <Text className="text-left font-bold">{name}</Text>
        <View className="flex-row items-center">
          <Image
            source={require("../../assets/icons/calendar_icon.png")}
            className="w-5 h-5"
          />
          <Text className="ml-2">{formatDate(orderDate)}</Text>
        </View>
        <Text className="text-left">{locName}</Text>
      </View>
      <View className="justify-center ">
        <Text className="text-right">{price} CHF</Text>
      </View>
    </View>
  );
};

export default OrderCard;
