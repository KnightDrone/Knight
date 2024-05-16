import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { Order, sortOrders } from "../../types/Order";
import TriangleBackground from "../../components/TriangleBackground";
import { RootStackParamList } from "../../types/RootStackParamList";
import { RouteProp } from "@react-navigation/native";
import { MessageBox } from "../../ui/MessageBox";
import { TextField } from "../../ui/TextField";
import FirestoreManager from "../../services/FirestoreManager";
import { useTranslation } from "react-i18next";
import { formatDate, OrderCard } from "../../components/cards/OrderCard";
import { Picker } from "@react-native-picker/picker";

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
      selectedValue={sortingOption}
      onValueChange={(itemValue, itemIndex) => setSortingOption(itemValue)}
    >
      {sortingOptions.map((option, index) => (
        <Picker.Item
          label={option.label}
          value={option.value}
          key={option.label}
        />
      ))}
    </Picker>
  );
};

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
  const [sortingOption, setSortingOption] = useState("descendingDate");

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
        className="mt-4 min-h-full mb-6"
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
