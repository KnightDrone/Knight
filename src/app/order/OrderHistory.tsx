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
import { Order, OrderStatus, sortOrders } from "../../types/Order";
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
import { auth } from "../../services/Firebase";
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
  const { historyOp } = route.params;
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [sortingOption, setSortingOption] = useState("descendingDate");
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setRefreshing(true);
    try {
      const field = historyOp ? "operatorId" : "userId";
      console.log("fetching orders for user: " + uid);
      let newOrders = await firestoreManager.queryOrder(field, uid || "");
      if (newOrders === null) {
        setError(new Error("Failed to fetch from database."));
      } else if (newOrders.length === 0) {
        historyOp
          ? setError(
              new Error("You have not accepted any orders yet as an operator.")
            )
          : setError(
              new Error("No orders have been made yet. Go place some orders :)")
            );
      } else {
        setOrders(newOrders);
        setError(null); // Clear the error if the fetch is successful
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setRefreshing(false);
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
        formatDate(order.getOrderDate()).includes(searchText)
    )
  );
  interface SortingPickerProps {
    sortingOption: string;
    setSortingOption: React.Dispatch<React.SetStateAction<string>>;
  }

  const SortingPicker: React.FC<SortingPickerProps> = ({
    sortingOption,
    setSortingOption,
  }) => {
    const sortingOptions = [
      { label: "Date ↓", value: "descendingDate" },
      { label: "Date ↑", value: "ascendingDate" },
      { label: "Price ↓", value: "descendingPrice" },
      { label: "Price ↑", value: "ascendingPrice" },
    ];

    return (
      <Picker
        style={{
          transform: [{ translateY: -6.5 }],
          color: "black",
          width: 140,
        }}
        // <Picker> is a component from @react-native-picker/picker, and as a result it is NOT comptabile with Nativewind
        //className="text-red-500"
        selectedValue={sortingOption}
        onValueChange={(itemValue, itemIndex) => setSortingOption(itemValue)}
      >
        {sortingOptions.map((option, index) => (
          <Picker.Item label={option.label} value={option.value} key={index} />
        ))}
      </Picker>
    );
  };
  return (
    <View className="mt-28" testID="order-history-screen">
      <View className="flex-row">
        <TextField
          className="w-6/12 mx-auto mt-4 bg-white ml-4"
          placeholder="Type here to search"
          onChangeText={setSearchText}
          value={searchText}
          type="text"
        />
        <View className="w-40 mx-auto mt-4 bg-gray-50 ml-1 relative h-12 rounded-full border border-gray-400 pb-8">
          <SortingPicker
            sortingOption={sortingOption}
            setSortingOption={setSortingOption}
          />
        </View>
      </View>
      {
        error && (
          <TriangleBackground color="#A0D1E4" bottom={-125} />
        ) /* These are some magic numbers that I figured out by trial and error*/
      }
      {!error && <TriangleBackground color="#A0D1E4" bottom={-200} />}
      {error && (
        <MessageBox
          message={error.message}
          style="error"
          onClose={() => setError(null)}
          testID="error-box"
        />
      )}

      <FlatList
        className="mt-4 max-h-[90%] min-h-[90%]"
        data={orderListFiltered}
        // if I am an operator, I want to see the user's location name
        // if I am user, I want to see where I ordered from
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            opBool={!historyOp}
            //onClick={() => console.log(item.getId())}
          />
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
