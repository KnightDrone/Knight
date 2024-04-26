import React from "react";
import { render } from "@testing-library/react-native";
import OrderHistory from "../src/app/OrderHistory";
import { Order, OrderStatus } from "../src/types/Order";
import { Item } from "../src/types/Item";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

describe("OrderHistory Component", () => {
  it("renders without crashing", () => {
    render(<OrderHistory />);
  });
});
