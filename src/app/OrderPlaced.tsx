import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import "./global.css";
import { Item } from "../types/Item";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/RootStackParamList";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Fontisto";
import { useFonts } from "expo-font";
import KaiseiRegular from "../../assets/fonts/KaiseiDecol-Regular.ttf";
import TriangleBackground from "../components/TriangleBackground";

const OrderPlaced = ({
  route,
  navigation,
}: {
  route: RouteProp<RootStackParamList, "OrderPlaced">;
  navigation: StackNavigationProp<RootStackParamList, "OrderPlaced">;
}) => {
  const [fontsLoaded] = useFonts({
    "Kaisei-Regular": KaiseiRegular,
  });

  const { orderedItem, placedAt, userLocation } = route.params;

  const [arrivalTime, setArrivalTime] = useState<number>(0);

  useEffect(() => {
    const additionalMinutes: number = 1 + Math.random() * 1;
    const arrivalTime = placedAt.valueOf() + additionalMinutes * 60 * 1000;
    setArrivalTime(arrivalTime);
  }, [placedAt]);

  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - placedAt.valueOf();
      const totalDuration = arrivalTime - placedAt.valueOf();
      const newCompletion = Math.min(100, (elapsed / totalDuration) * 100);

      setCompletion(newCompletion);

      if (newCompletion >= 100) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [placedAt, arrivalTime]);

  const getFormattedArrivalTime = (arrivalDate: Date): string => {
    const formattedDate: string = arrivalDate.toLocaleString("en-CH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `Arriving at ${formattedDate}`;
  };

  return (
    <View
      className="flex w-full h-full p-4 justify-center items-center"
      testID="order-placed-screen"
    >
      <TriangleBackground color="#A0D1e4" />
      <View className="flex w-full flex-col items-center">
        <Text
          className=" text-3xl font-bold font-kaisei"
          testID="order-placed-message"
        >
          Your order is on its way
        </Text>
        <View className="my-2 flex justify-start">
          <Text className="text-lg my-2 font-kaisei" testID="arrival-time">
            {getFormattedArrivalTime(new Date(arrivalTime))}
          </Text>
        </View>

        {/* Loading bar and helicopter icon */}
        <View className="w-full bg-gray-200 rounded-lg relative">
          <View
            className="bg-blue-500 h-4 rounded-lg"
            style={{ width: `${Math.min(completion, 100)}%` }}
            testID="loading-bar"
          ></View>
          <View
            style={{
              position: "absolute",
              left: `${Math.min(completion, 100)}%`,
              transform: [{ translateX: -40 }],
            }}
          >
            <Icon name="helicopter-ambulance" size={50} color="#000000" />
          </View>
        </View>

        <View
          className="p-4 rounded-lg my-10  w-11/12 justify-center items-center"
          style={{ backgroundColor: "#FFFBF1" }}
        >
          <Text
            className="text-2xl font-semibold font-kaisei"
            testID="order-summary"
          >
            Order summary
          </Text>
          <Text className="text-xl my-2 font-kaisei" testID="ordered-item-name">
            {orderedItem.getName()}
          </Text>
          <Text className="text-lg font-kaisei" testID="user-location">
            Location: {userLocation}
          </Text>
          <Image
            className="w-64 h-64 rounded-lg"
            testID="ordered-item-image"
            source={orderedItem.getImage()}
          />
        </View>

        <View
          className="w-11/12 p-4 rounded-lg mt-2 justify-center items-center"
          style={{
            opacity: completion >= 100 ? 1 : 0,
          }}
        >
          <Text
            className="text-lg font-semibold font-kaisei"
            testID="order-complete"
          >
            Your order should have been delivered!
          </Text>
          <Text className="text-lg font-kaisei" testID="order-complete-message">
            Thanks for trusting us!
          </Text>
          <TouchableOpacity>
            <Text className="text-red-500 font-kaisei" testID="report-issue">
              Report an issue
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="mt-4"
          testID="view-order-history"
          onPress={() =>
            navigation.navigate("OrderHistory", { opOrders: true })
          }
        >
          <Text className="text-black font-kaisei underline">
            View order history
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderPlaced;
