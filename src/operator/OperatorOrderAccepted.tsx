import React from "react";
import { View, Text, Button } from "react-native";
import { Order } from "../types/Order"; // Adjust the import path as necessary
import { StackNavigationProp } from "@react-navigation/stack";
type Props = {
  route: {
    params: {
      order: Order;
    };
  };
  navigation: StackNavigationProp<any>;
};
const OperatorOrderAccepted: React.FC<Props> = ({ route, navigation }) => {
  const { order } = route.params;
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        You have accepted the order!
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>
        Item: {order.getItem().getName()}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>
        Status: {order.getStatus()}
      </Text>
      <Button
        title="Go to Dashboard"
        onPress={() => navigation.navigate("Map")} // Assuming 'OperatorDashboard' is a valid screen
      />
    </View>
  );
};
export default OperatorOrderAccepted;
