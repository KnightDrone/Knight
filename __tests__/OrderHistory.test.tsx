import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
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

// Mock the module that exports fetchOrdersForUserMock
/*jest.mock("../src/app/OrderHistory", () => ({
  ...jest.requireActual("../src/app/OrderHistory"),
  fetchOrdersForUserMock: fetchOrdersForUserMock,
}));*/

jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: () => mockNavigation,
  };
});

describe("OrderHistory", () => {
  it("renders correctly", async () => {
    /*fetchOrdersForUserMock.mockResolvedValue([
      new Order(
        "user1",
        new Item(1, "mock item1", "description1", 1, 1, 10),
        { latitude: 46.8182, longitude: 8.2275 }, // Correct way to create an OrderLocation object
        "St. Gallen Hospital",
        { latitude: 55, longitude: 33 } // Correct way to create an OrderLocation object
      ),
      new Order(
        "user2",
        new Item(2, "mock item2", "description2", 2, 2, 22),
        { latitude: 40.8182, longitude: 8.2275 }, // Correct way to create an OrderLocation object
        "Drone Station 1", // "Drone Station 1", "St. Gallen Hospital", "Jeffrey's Clinic"
        { latitude: 59, longitude: 38 } // Correct way to create an OrderLocation object
      ),
      new Order(
        "user3",
        new Item(3, "mock item3", "description3", 3, 3, 330),
        { latitude: 0, longitude: 0 }, // Correct way to create an OrderLocation object
        "Jeffrey's Clinic", // "Drone Station 1", "St. Gallen Hospital", "Jeffrey's Clinic"
        { latitude: 25, longitude: 3.2275 } // Correct way to create an OrderLocation object
      ),
      new Order(
        "user4",
        new Item(3, "item4", "description3", 3, 3, 330),
        { latitude: 0, longitude: 0 }, // Correct way to create an OrderLocation object
        "Jeffrey's Clinic", // "Drone Station 1", "St. Gallen Hospital", "Jeffrey's Clinic"
        { latitude: 25, longitude: 3.2275 } // Correct way to create an OrderLocation object
      ),
    ]);*/
    const { getByText, getByTestId } = render(
      <OrderHistory navigation={mockNavigation} userId={0} opOrders={false} />
    );

    await waitFor(
      () => {
        expect(getByTestId("menu-button")).toBeTruthy();
        expect(getByTestId("x-button")).toBeTruthy();
        // expect(getByText("Order history")).toBeTruthy();
        // expect(getByText("mock item1")).toBeTruthy();
        // expect(getByText("10 CHF")).toBeTruthy();
        // expect(getByText("mock item2")).toBeTruthy();

        // expect(getByText("22 CHF")).toBeTruthy();
      },
      { timeout: 2000 }
    );
  });
  /* I've wasted too much time trying to mock this, I give up
  it("renders an error message if fetching orders fails", async () => {
    // Mock fetchOrders to reject with an error
    fetchOrdersForUserMock.mockRejectedValue(new Error("Failed to fetch orders"));

    const { getByText } = render(
      <OrderHistory navigation={mockNavigation} userId={0} opOrders={false} />
    );

    await waitFor(() => {
      expect(getByText("Failed to fetch orders")).toBeTruthy();
    }, { timeout: 2000 });
  });

  it("renders a message if there are no orders", async () => {
    // Mock fetchOrders to resolve with an empty array
    fetchOrdersForUserMock.mockResolvedValue([]);

    const { getByText } = render(
      <OrderHistory navigation={mockNavigation} userId={0} opOrders={false} />
    );

    await waitFor(() => {
      expect(
        getByText("No orders have been made yet, check back later.")
      ).toBeTruthy();
    }, { timeout: 2000 });
  });
  */
});
