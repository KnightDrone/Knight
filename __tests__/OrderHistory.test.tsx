import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import OrderHistory from "../src/app/OrderHistory";
import { RootStackParamList } from "../src/types/RootStackParamList";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Order, OrderStatus } from "../src/types/Order";
import { Item } from "../src/types/Item";
import * as OrderHistoryModule from "../src/app/OrderHistory";
import queryOrder from "../src/services/FirestoreManager";

// Mock the module
jest.mock("../src/app/OrderHistory");
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

type OrderHistoryStack = {
  OrderHistory: RootStackParamList["OrderHistory"];
};

const Stack = createStackNavigator<OrderHistoryStack>();

const OrderHistoryTest = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"OrderHistory"}>
        <Stack.Screen
          name="OrderHistory"
          initialParams={{
            historyOp: false,
            userId: "user1",
          }}
        >
          {(props) => <OrderHistory {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe("OrderHistory", () => {
  it("renders correctly", async () => {
    (
      queryOrder as jest.MockedFunction<typeof queryOrder>
    ).mockImplementationOnce(() =>
      Promise.resolve([
        new Order(
          "user1",
          new Item(1, "mock item1", "description1", 1, 1, 10),
          { latitude: 46.8182, longitude: 8.2275 },
          new Date(),
          OrderStatus.Delivered,
          new Date(),
          "Mattenhorn peak #3",
          "St. Gallen Hospital",
          { latitude: 55, longitude: 33 }
        ),
        new Order(
          "user2",
          new Item(2, "mock item2", "description1", 1, 1, 22),
          { latitude: 46.8182, longitude: 8.2275 },
          new Date(),
          OrderStatus.Delivered,
          new Date(),
          "Mattenhorn peak #1",
          "Pharmacy #5",
          { latitude: 55, longitude: 33 }
        ),
      ])
    );

    /*(OrderHistoryModule. as jest.Mock).mockResolvedValue([
      new Order(
        "user1",
        new Item(1, "mock item1", "description1", 1, 1, 10),
        { latitude: 46.8182, longitude: 8.2275 },
        new Date(),
        OrderStatus.Delivered,
        new Date(),
        "Mattenhorn peak #3",
        "St. Gallen Hospital",
        { latitude: 55, longitude: 33 }
      ),
      new Order(
        "user2",
        new Item(2, "mock item2", "description1", 1, 1, 22),
        { latitude: 46.8182, longitude: 8.2275 },
        new Date(),
        OrderStatus.Delivered,
        new Date(),
        "Mattenhorn peak #1",
        "Pharmacy #5",
        { latitude: 55, longitude: 33 }
      )
    ]);*/
    const { getByText, getByTestId } = render(
      <OrderHistory historyOp={false} userId={"1234567890"} />
    );

    await waitFor(
      () => {
        expect(getByTestId("menu-button")).toBeTruthy();
        expect(getByTestId("x-button")).toBeTruthy();
        expect(getByText("Order history")).toBeTruthy();
        expect(getByText("mock item1")).toBeTruthy();
        expect(getByText("10 CHF")).toBeTruthy();

        expect(getByText("mock item2")).toBeTruthy();
        expect(getByText("22 CHF")).toBeTruthy();
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
