import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import "./global.css";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/RootStackParamList";
import Icon from "react-native-vector-icons/Fontisto";
import TriangleBackground from "../components/TriangleBackground";
import { Animated } from "react-native";
import { secureRandom } from "../utils/random";
import { useTranslation } from "react-i18next";
import { TranslationKeys } from "../types/translation-keys";

const OrderPlaced = ({
  route,
  navigation,
}: {
  route: RouteProp<RootStackParamList, "OrderPlaced">;
  navigation: any;
}) => {
  const { t } = useTranslation();

  const [fadeAnim] = useState(new Animated.Value(0));
  const { orderedItem, placedAt, userLocation } = route.params;

  const [arrivalTime, setArrivalTime] = useState<number>(0);

  useEffect(() => {
    const additionalMinutes: number = 10 + secureRandom() * 15;
    const arrivalTime = placedAt + additionalMinutes * 60 * 1000;
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

  useEffect(() => {
    if (completion >= 100) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [completion]);

  const getFormattedArrivalTime = (arrivalDate: Date): string => {
    const formattedDate: string = arrivalDate.toLocaleString("en-CH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${t("order-placed.arriving-at")} ${formattedDate}`;
  };

  return (
    <View
      className="flex flex-col gap-3 w-full h-full p-4 justify-center items-center"
      testID="order-placed-screen"
    >
      <TriangleBackground color="#A0D1E4" />
      <View className="flex w-full flex-col items-center">
        <Text className=" text-3xl font-bold" testID="order-placed-message">
          {t("order-placed.on-its-way")}
        </Text>
        <View className="my-2 flex items-start">
          <Text className="text-lg my-2" testID="arrival-time">
            {getFormattedArrivalTime(new Date(arrivalTime))}
          </Text>
        </View>

        {/* Loading bar and helicopter icon */}
        <View className="w-11/12 bg-gray-200 rounded-lg relative">
          <View
            className="bg-blue-800 h-2 rounded-lg"
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
          className="p-4 rounded-lg mt-24  w-11/12 justify-center items-center"
          style={{ backgroundColor: "#FFFBF1" }}
        >
          <Text className="text-2xl font-semibold" testID="order-summary">
            {t("order-placed.order-summary")}
          </Text>
          <Text className="text-xl my-2" testID="ordered-item-name">
            {t(orderedItem.getName() as TranslationKeys)}
          </Text>
          <Text className="text-lg" testID="user-location">
            {t("order-placed.location")} {userLocation}
          </Text>
          <Image
            className="w-64 h-64 rounded-lg"
            testID="ordered-item-image"
            source={orderedItem.getImage()}
          />
        </View>

        <Animated.View
          className="w-11/12 p-4 rounded-lg mt-2 justify-center items-center"
          style={{
            opacity: fadeAnim,
          }}
        >
          <Text className="text-lg font-semibold" testID="order-complete">
            {t("order-placed.order-complete")}
          </Text>
          <Text className="text-lg" testID="order-complete-message">
            {t("order-placed.thanks")}
          </Text>
          {/* <TouchableOpacity>
            <Text className="text-red-500" testID="report-issue">
              Report an issue
            </Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            className="bg-blue-700 mt-4 w-4/5 rounded-lg p-2 text-white items-center"
            onPress={() => navigation.navigate("Map")}
            style={{
              opacity: completion >= 100 ? 1 : 0,
            }}
          >
            <Text className="text-white">Continue</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          className="mt-4"
          testID="view-order-history"
          onPress={() =>
            navigation.navigate("OrderHistory", { opOrders: true })
          }
        >
          <Text className="text-black underline">
            {t("order-placed.view-order-history")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderPlaced;
