import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Order } from "../types/Order";
import { TouchableOpacity } from "react-native";

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

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
}

const OrderCard = ({ order, onClick }: OrderCardProps) => {
  const item = order.getItem();
  const name = item.getName();
  const orderDate = order.getOrderDate();
  const price = item.getPrice();
  //let locName = order.getOpName();
  const [locName, setLocName] = useState(order.getOpName());
  // Attempt to fetch the location name from the coordinates using Nominatim API
  /*useEffect(() => {
    if (locName === "") {
      const location = order.getLocation();
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`)
        .then(response => response.json())
        .then(data => setLocName(data.display_name))
        .catch(error => console.error(error));
    }
  }, []);*/
  if (locName === "") {
    const location = order.getLocation();
    setLocName(`Lat: ${location.latitude}, Long: ${location.longitude}`);
  }
  const content = (
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
  );
  // The OrderCards are clickable only if the onClick function is passed as a prop, this is for the purpose of OrderCard's in the context of History vs Pending Orders
  return onClick ? (
    <TouchableOpacity
      className="bg-white flex-1 rounded-lg shadow-md m-2 flex-row p-2 border-2 border-gray-300"
      onPress={onClick}
    >
      {content}
      <View className="justify-center ">
        <Text className="text-right">{price} CHF</Text>
      </View>
    </TouchableOpacity>
  ) : (
    <View className="bg-white flex-1 rounded-lg shadow-md m-2 flex-row p-2 border-2 border-gray-300">
      {content}
      <View className="justify-center ">
        <Text className="text-right">{price} CHF</Text>
      </View>
    </View>
  );
};

export default OrderCard;
