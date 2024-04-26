import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import OrderCard from "../components/OrderCard";
import { Button } from "../ui/Button";
import { Order } from "../types/Order";
import { Item } from "../types/Item";
import TriangleBackground, {
  TriangleBackground2,
} from "../components/TriangleBackground";

/* 
NOTE: This is a temporary solution to simulate fetching pending orders from a server. Should be replaced with actual database calls
*/
const fetchPendingOrders = async (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const orders: Order[] = [
        // Replace with predefined set pending orders
        new Order(
          "user1",
          new Item(1, "item1", "description1", 1, 1, 10),
          { latitude: 46.8182, longitude: 8.2275 } // Correct way to create an OrderLocation object
        ),
        new Order(
          "user2",
          new Item(2, "item2", "description2", 2, 2, 22),
          { latitude: 40.8182, longitude: 8.2275 } // Correct way to create an OrderLocation object
        ),
        new Order(
          "user3",
          new Item(3, "item3", "description3", 3, 3, 330),
          { latitude: 0, longitude: 0 } // Correct way to create an OrderLocation object
        ),
        new Order(
          "user4",
          new Item(3, "item4", "description3", 3, 3, 330),
          { latitude: 20, longitude: 50 } // Correct way to create an OrderLocation object
        ),
      ];
      // Call locSearch for each order and wait for all to complete, Nominatim API to search
      await Promise.all(orders.map((order) => order.locSearch()));
      resolve(orders);
    }, 1000); // 1 second delay
  });
};

// TODO: Maybe add some search bar to filter?

const PendingOrders = ({ navigation }: any) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    fetchOrders();
  }, []);
  // ------------ Handle card opening and closing ------------
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const handleOpenCard = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseCard = () => {
    setSelectedOrder(null);
  };
  const handleAcceptOrder = () => {
    // Call necessary function from Firestore class to update the order status
    setSelectedOrder(null);
  };
  // ---------------------------------------------------------
  const fetchOrders = async () => {
    setRefreshing(true);
    const newOrders = await fetchPendingOrders();
    // Sort the orders by date so that the oldest orders are shown first
    const sortedOrders = newOrders.sort(
      (a, b) => a.getOrderDate().getTime() - b.getOrderDate().getTime()
    );
    setOrders(sortedOrders);
    setRefreshing(false);
  };

  return (
    <View className="mt-16" testID="pending-orders-screen">
      <View className="flex-row items-center justify-center">
        <TouchableOpacity className="absolute left-4" testID="menu-button">
          <Image
            source={require("../../assets/icons/menu_icon.png")}
            className="w-9 h-9"
            testID="menu-icon"
          />
        </TouchableOpacity>
        <Text
          className="text-2xl font-bold text-center my-4"
          testID="pending-orders-title"
        >
          Pending Orders
        </Text>
        <TouchableOpacity
          className="absolute right-4"
          testID="close-button"
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../../assets/icons/x_icon.png")}
            className="w-5 h-5"
            testID="close-icon"
          />
        </TouchableOpacity>
      </View>

      <TriangleBackground2 />

      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onClick={() => handleOpenCard(item)}
            opBool={false}
          /> // opBool is false because we want to show the user's location name
        )}
        keyExtractor={(item) => item.getId()}
        onEndReached={fetchOrders}
        onEndReachedThreshold={0.1}
        refreshing={refreshing}
        onRefresh={fetchOrders}
        testID="order-list"
      />
      {selectedOrder && (
        <Modal animationType="none" transparent={true} visible={true}>
          <View className="flex-1 justify-center items-center bg-opacity-100">
            <View className="bg-white border-2 border-gray-500 p-5 items-start justify-start shadow-lg w-[300] h-[180] rounded-lg relative">
              <TouchableOpacity
                onPress={() => handleCloseCard()}
                className="absolute right-5 top-5 "
              >
                <Image
                  source={require("../../assets/icons/x_icon.png")}
                  className="w-5 h-5"
                />
              </TouchableOpacity>
              <Text className="text-center font-bold text-xl pt-5 pb-6">
                {`Would you like to accept the order for ${selectedOrder.getItem().getName()} from ${selectedOrder.getUser()}?`}
              </Text>

              <Button
                text="Accept Order"
                onPress={handleAcceptOrder}
                style="primary"
                className="shadow-lg"
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default PendingOrders;
