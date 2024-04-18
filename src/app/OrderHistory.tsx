import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import OrderCard from "../components/OrderCard";
import { Order, OrderStatus } from "../types/Order";
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
          "4863-1b1b-4f0d-8f3b-0f0f", // ORDER ID
          "user1",
          new Item(1, "item1", "description1", 1, 1, 10),
          new Date("2022-01-01"),
          OrderStatus.Delivered,
          new Date("2022-01-02"),
          46.8182,
          8.2275,
          "St. Gallen Hospital", // "Drone Station 1", "St. Gallen Hospital", "Jeffrey's Clinic"
          46.8182,
          8.2275
        ),
        new Order(
          "5763-1b1b-4f0d-8f3b-0f0f",
          "user2",
          new Item(2, "item2", "description2", 2, 2, 22),
          new Date("2022-02-01"),
          OrderStatus.Cancelled,
          new Date("2022-02-02"),
          46.8182,
          8.2275,
          "Drone Station 1", // "Drone Station 1", "St. Gallen Hospital", "Jeffrey's Clinic"
          46.8182,
          8.2275
        ),
        new Order(
          "5799-1b1b-4f0d-8f3b-0f0f",
          "user3",
          new Item(3, "item3", "description3", 3, 3, 330),
          new Date("2022-03-01"),
          OrderStatus.Pending,
          new Date("2022-03-02"),
          46.8182,
          8.2275,
          "Jeffrey's Clinic", // "Drone Station 1", "St. Gallen Hospital", "Jeffrey's Clinic"
          46.8182,
          8.2275
        ),
      ];
      resolve(orders);
    }, 1000); // 1 second delay
  });
};

const OrderHistory = ({ userId }: any) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const newOrders = await fetchOrdersForUser(userId);
    setOrders((prevOrders) => [...prevOrders, ...newOrders]);
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
      />
    </View>
  );
};

export default OrderHistory;
