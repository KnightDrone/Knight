import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import OrderCard from "../components/OrderCard";
import { Order, OrderLocation, OrderStatus } from "../types/Order";
import { Item } from "../types/Item";

/* 
NOTE: This is a temporary solution to simulate fetching orders from a server. Should be replaced with actual database calls
*/
const fetchOrdersForUser = async (userId: String): Promise<Order[]> => {
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
      ];
      resolve(orders);
    }, 1000); // 1 second delay
  });
};

// TODO: Maybe add some search bar to filter?

const OrderHistory = ({ userId }: any) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setRefreshing(true);
    const newOrders = await fetchOrdersForUser(userId);
    // Filter out orders that are already in the list
    const orderIds = new Set(orders.map((order) => order.getId()));
    const uniqueOrders = newOrders.filter(
      (newOrder) => !orderIds.has(newOrder.getId())
    );
    // Combine the old orders with the new ones and sort them by date so that the most recent orders are shown first
    const sortedOrders = [...orders, ...uniqueOrders].sort(
      (a, b) => b.getOrderDate().getTime() - a.getOrderDate().getTime()
    );
    setOrders(sortedOrders);
    setRefreshing(false);
  };

  return (
    <View>
      <Text className="text-2xl font-bold text-center my-4">Order history</Text>
      <FlatList
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
