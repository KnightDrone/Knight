import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import OrderCard from "../components/OrderCard";
import { Order, OrderLocation, OrderStatus } from "../types/Order";
import { Item } from "../types/Item";
import TriangleBackground from "../components/TriangleBackground";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../types/RootStackParamList";
import { RouteProp } from "@react-navigation/native";

/* 
NOTE: This is a temporary solution to simulate fetching orders from a server. Should be replaced with actual database calls
*/
// depending on the value of OP orders we should fetch orders from the history of orders, where the user was operator, or where the user was the buyer
// Still waiting for Firestore class to be implemented
const fetchOrdersForUser = async (
  userId: String,
  opOrders: Boolean
): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders: Order[] = [
        // Replace with your predefined set of Order objects
        new Order(
          "user1",
          new Item(1, "item1", "description1", 1, 1, 10),
          { latitude: 46.8182, longitude: 8.2275 }, // Correct way to create an OrderLocation object
          "St. Gallen Hospital",
          { latitude: 55, longitude: 33 } // Correct way to create an OrderLocation object
        ),
        new Order(
          "user2",
          new Item(2, "item2", "description2", 2, 2, 22),
          { latitude: 40.8182, longitude: 8.2275 }, // Correct way to create an OrderLocation object
          "Drone Station 1", // "Drone Station 1", "St. Gallen Hospital", "Jeffrey's Clinic"
          { latitude: 59, longitude: 38 } // Correct way to create an OrderLocation object
        ),
        new Order(
          "user3",
          new Item(3, "item3", "description3", 3, 3, 330),
          { latitude: 0, longitude: 0 }, // Correct way to create an OrderLocation object
          "Jeffrey's Clinic", // "Drone Station 1", "St. Gallen Hospital", "Jeffrey's Clinic"
          { latitude: 25, longitude: 3.2275 } // Correct way to create an OrderLocation object
        ),
        new Order(
          "user4",
          new Item(3, "item4", "description3", 3, 3, 330),
          { latitude: 0, longitude: 0 }, // Correct way to create an OrderLocation object
          "Jeffrey's Clinic", // "Drone Station 1", "St. Gallen Hospital", "Jeffrey's Clinic"
          { latitude: 25, longitude: 3.2275 } // Correct way to create an OrderLocation object
        ),
      ];
      resolve(orders);
    }, 1000); // 1 second delay
  });
};

// TODO: Maybe add some search bar to filter?

const OrderHistory = ({
  route,
  navigation,
}: {
  route: RouteProp<RootStackParamList, "OrderHistory">;
  navigation: any;
}) => {
  const { opOrders } = route.params;

  const [userId, setUserId] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const userJSON = await AsyncStorage.getItem("@user");
      console.log(userJSON);
    };

    fetchUser();

    return () => {
      // Cleanup function
    };
  }, [refreshing]);

  const fetchOrders = async () => {
    setRefreshing(true);
    const newOrders = await fetchOrdersForUser(userId, opOrders);
    // Sort the orders by date so that the most recent orders are shown first
    const sortedOrders = newOrders.sort(
      (a, b) => b.getOrderDate().getTime() - a.getOrderDate().getTime()
    );
    setOrders(sortedOrders);
    setRefreshing(false);
  };
  return (
    <View className="mt-16" testID="order-history-screen">
      <TriangleBackground color="#A0D1e4" />
      <View className="flex-row items-center justify-center">
        <TouchableOpacity className="absolute left-4">
          <Image
            source={require("../../assets/icons/menu_icon.png")}
            className="w-9 h-9"
          />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-center my-4">
          Order history
        </Text>
        <TouchableOpacity
          className="absolute right-4"
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../../assets/icons/x_icon.png")}
            className="w-5 h-5"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        className="mt-4 min-h-full"
        data={orders}
        renderItem={({ item }) => <OrderCard order={item} />}
        keyExtractor={(item) => item.getId()}
        onEndReached={fetchOrders}
        onEndReachedThreshold={0.1}
        refreshing={refreshing}
        onRefresh={fetchOrders}
      />
    </View>
  );
};

export default OrderHistory;
