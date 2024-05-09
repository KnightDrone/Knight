import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import OrderCard from "../../components/cards/OrderCard";
import { Order, OrderStatus } from "../../types/Order";
import { Item } from "../../types/Item";
import TriangleBackground from "../../components/TriangleBackground";
import { RootStackParamList } from "../../types/RootStackParamList";
import { RouteProp } from "@react-navigation/native";
import { MessageBox } from "../../ui/MessageBox";
import { TextField } from "../../ui/TextField";
import FirestoreManager from "../../services/FirestoreManager";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../components/cards/OrderCard";
import { Picker } from "@react-native-picker/picker";
/* 
NOTE: This is a temporary solution to simulate fetching orders from a server. Should be replaced with actual database calls
*/
// depending on the value of OP orders we should fetch orders from the history of orders, where the user was operator, or where the user was the buyer
// Still waiting for Firestore class to be implemented
/*const fetchOrdersForUserMock = async (
  userId: String,
  opOrders: Boolean
): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders: Order[] = [
        new Order(
          "user1",
          new Item(1, "mock item1", "description1", 10, 1, 1),
          { latitude: 46.8182, longitude: 8.2275 }, // Correct way to create an OrderLocation object
          new Date(),
          OrderStatus.Delivered,
          new Date(),
          "Mattenhorn peak #3",
          "St. Gallen Hospital",
          { latitude: 55, longitude: 33 } // Correct way to create an OrderLocation object
        ),
        new Order(
          "user2",
          new Item(2, "mock item2", "description2", 22, 2, 2),
          { latitude: 40.8182, longitude: 8.2275 }, // Correct way to create an OrderLocation object
          new Date(),
          OrderStatus.Delivered,
          new Date(),
          "Zermatt waterfalls",
          "Drone Station 1", // "Drone Station 1", "St. Gallen Hospital", "Jeffrey's Clinic"
          { latitude: 59, longitude: 38 } // Correct way to create an OrderLocation object
        ),
      ];
      resolve(orders);
    }, 1000); // 1 second delay
  });
};*/

// TODO: Maybe add some search bar to filter?

const OrderHistory = ({
  route,
  navigation,
}: {
  route: RouteProp<RootStackParamList, "OrderHistory">;
  navigation: any;
}) => {
  const firestoreManager = new FirestoreManager();
  const { historyOp, userId } = route.params;
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [sortingOption, setSortingOption] = useState("ascendingDate");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setRefreshing(true);
    try {
      const field = historyOp ? "operatorId" : "userId";
      let newOrders = await firestoreManager.queryOrder(field, userId);
      if (newOrders === null) {
        setError(new Error("Failed to fetch from database."));
      } else if (newOrders.length === 0) {
        setError(
          new Error("No orders have been made yet. Go place some orders :)")
        );
      } else {
        const sortedOrders = newOrders.sort(
          (a, b) => b.getOrderDate().getTime() - a.getOrderDate().getTime()
        );
        setOrders(sortedOrders);
        setError(null); // Clear the error if the fetch is successful
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setRefreshing(false);
    }
  };

  const sortOrders = (option: string, orders: Order[]) => {
    switch (option) {
      case "ascendingDate":
        return [...orders].sort(
          (a, b) => a.getOrderDate().getTime() - b.getOrderDate().getTime()
        );
      case "descendingDate":
        return [...orders].sort(
          (a, b) => b.getOrderDate().getTime() - a.getOrderDate().getTime()
        );
      case "ascendingPrice":
        return [...orders].sort(
          (a, b) => b.getItem().getPrice() - a.getItem().getPrice()
        );
      case "descendingPrice":
        return [...orders].sort(
          (a, b) => a.getItem().getPrice() - b.getItem().getPrice()
        );
      default:
        return orders;
    }
  };
  const orderListFiltered = sortOrders(
    sortingOption,
    orders.filter(
      (order) =>
        order
          .getItem()
          .getName()
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        order.getOpName().toLowerCase().includes(searchText.toLowerCase()) ||
        order.getUsrLocName().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <View className="mt-16" testID="order-history-screen">
      <View className="flex-row items-center justify-center">
        <TouchableOpacity className="absolute left-4" testID="menu-button">
          <Image
            source={require("../../../assets/icons/menu_icon.png")}
            className="w-9 h-9"
          />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-center my-4">
          {t("order-history.title")}
        </Text>
        <TouchableOpacity
          className="absolute right-4"
          testID="x-button"
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../../../assets/icons/x_icon.png")}
            className="w-5 h-5"
            testID="x-icon"
          />
        </TouchableOpacity>
      </View>
      <View className="flex-row">
        <TextField
          className="p-4 w-6/12 mx-auto mt-4 bg-white ml-4"
          placeholder="Type here to search"
          onChangeText={setSearchText}
          value={searchText}
          type="text"
        />
        <View className="w-40 mx-auto mt-4 bg-gray-50 ml-4 relative h-12 rounded-full border border-gray-400 pb-8">
          <Picker
            selectedValue={sortingOption}
            onValueChange={(itemValue, itemIndex) =>
              setSortingOption(itemValue)
            }
          >
            <Picker.Item label="Date ↓" value="descendingDate" />
            <Picker.Item label="Date ↑" value="ascendingDate" />
            <Picker.Item label="Price ↓" value="descendingPrice" />
            <Picker.Item label="Price ↑" value="ascendingPrice" />
          </Picker>
        </View>
      </View>
      {
        error && (
          <TriangleBackground color="#A0D1E4" bottom={-45} />
        ) /* These are some magic numbers that I figured out by trial and error*/
      }
      {!error && <TriangleBackground color="#A0D1E4" bottom={-120} />}
      {error && (
        <MessageBox
          message={error.message}
          style="error"
          onClose={() => setError(null)}
          testID="error-box"
        />
      )}

      <FlatList
        className="mt-4 min-h-full"
        data={orderListFiltered}
        // if I am an operator, I want to see the user's location name
        // if I am user, I want to see where I ordered from
        renderItem={({ item }) => (
          <OrderCard order={item} opBool={!historyOp} />
        )}
        keyExtractor={(item) => item.getId()}
        onEndReached={fetchOrders}
        onEndReachedThreshold={0.1}
        refreshing={refreshing}
        onRefresh={fetchOrders}
        extraData={searchText}
        testID="orderHistoryFlatList"
      />
    </View>
  );
};

export default OrderHistory;
