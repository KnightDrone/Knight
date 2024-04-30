import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import fetchOrdersForUserMock from "../src/app/OrderHistory";
import OrderHistory from "../src/app/OrderHistory";
import { Order, OrderStatus } from "../src/types/Order";
import { Item } from "../src/types/Item";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
};

jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: () => mockNavigation,
  };
});

describe("OrderHistory", () => {
  it("renders correctly", async () => {
    const { getByText } = render(
      <OrderHistory navigation={mockNavigation} userId={0} opOrders={false} />
    );

    await waitFor(
      () => {
        expect(getByText("Order history")).toBeTruthy();
        expect(getByText("mock item1")).toBeTruthy();
        expect(getByText("10 CHF")).toBeTruthy();
        expect(getByText("mock item2")).toBeTruthy();

        expect(getByText("22 CHF")).toBeTruthy();
      },
      { timeout: 2000 }
    );
  });

  it("refreshes orders when pulled", async () => {
    //(fetchOrdersForUserMock as jest.Mock).jest.fn()
    const fetchOrders = jest.fn();
    const { getByTestId } = render(
      <OrderHistory navigation={mockNavigation} userId={0} opOrders={false} />
    );

    const flatList = getByTestId("orderHistoryFlatList");
    // fireEvent(getByTestId("refresh"), "onRefresh");
    flatList.props.onRefresh();

    await waitFor(() => {
      expect(fetchOrders).toHaveBeenCalledTimes(1);
    });
  });

  it("displays a message when there are no orders", async () => {
    const { fetchOrdersForUserMock } = jest.requireMock(
      "../src/app/OrderHistory"
    );
    fetchOrdersForUserMock.mockResolvedValue([]);

    const { getByText } = render(
      <OrderHistory navigation={mockNavigation} userId={0} opOrders={false} />
    );

    await waitFor(() => {
      expect(getByText("No orders found")).toBeTruthy();
    });
  });
});
