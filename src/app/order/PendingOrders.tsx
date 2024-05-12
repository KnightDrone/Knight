import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import OrderCard from "../../components/cards/OrderCard";
import { Button } from "../../ui/Button";
import { Order, OrderStatus, sortOrders } from "../../types/Order";
import { Item } from "../../types/Item";
import TriangleBackground from "../../components/TriangleBackground";
import FirestoreManager from "../../services/FirestoreManager";
import { MessageBox } from "../../ui/MessageBox";
import { formatDate } from "../../components/cards/OrderCard";
import { Picker } from "@react-native-picker/picker";
import { TextField } from "../../ui/TextField";
/* 
NOTE: This is a temporary solution to simulate fetching pending orders from a server. Should be replaced with actual database calls
*/
/*const fetchPendingOrdersMock = async (): Promise<Order[]> => {
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
};*/

// TODO: Maybe add some search bar to filter?

const PendingOrders = ({ navigation }: any) => {
  const firestoreManager = new FirestoreManager();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchText, setSearchText] = useState("");
  const [sortingOption, setSortingOption] = useState("ascendingDate");
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
  const orderListFiltered = sortOrders(
    sortingOption,
    orders.filter(
      (order) =>
        order
          .getItem()
          .getName()
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        order
          .getUsrLocName()
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        formatDate(order.getOrderDate()).includes(searchText)
    )
  );
  const fetchOrders = async () => {
    setRefreshing(true);
    try {
      const newOrders = await firestoreManager.queryOrder(
        "status",
        OrderStatus.Pending
      );
      if (newOrders === null) {
        setError(new Error("Failed to fetch from database."));
      } else if (newOrders.length === 0) {
        setError(
          new Error("No orders pending orders at the moment, check back later.")
        );
      } else {
        // Sort the orders by date so that the oldest orders are shown first
        /*const sortedOrders = newOrders.sort(
          (a, b) => a.getOrderDate().getTime() - b.getOrderDate().getTime()
        );*/
        setOrders(newOrders);
        setError(null); // Clear the error if the fetch is successful
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setRefreshing(false);
    }
  };

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
    <View className="mt-16" testID="pending-orders-screen">
      <View className="flex-row items-center justify-center">
        <TouchableOpacity className="absolute left-4" testID="menu-button">
          <Image
            source={require("../../../assets/icons/menu_icon.png")}
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
            source={require("../../../assets/icons/x_icon.png")}
            className="w-5 h-5"
            testID="close-icon"
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
        <View className="w-40 mx-auto mt-4 bg-gray-50 ml-4 relative h-12 rounded-full border border-gray-400 pb-8">
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
        className="mt-4 min-h-full"
        data={orderListFiltered}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onClick={() => handleOpenCard(item)}
            opBool={false}
            testId={`order-card-${item.getId()}`}
            onClickTestId={`order-card-${item.getId()}-button`}
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
                testID="close-card-button"
                onPress={() => handleCloseCard()}
                className="absolute right-5 top-5 "
              >
                <Image
                  source={require("../../../assets/icons/x_icon.png")}
                  className="w-5 h-5"
                />
              </TouchableOpacity>
              <Text className="text-center font-bold text-xl pt-5 pb-6">
                {`Would you like to accept the order for ${selectedOrder.getItem().getName()} from ${selectedOrder.getUserId()}?`}
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
