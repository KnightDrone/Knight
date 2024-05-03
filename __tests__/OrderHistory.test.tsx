import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import OrderHistory from "../src/app/OrderHistory";
import { RootStackParamList } from "../src/types/RootStackParamList";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { initI18n } from "../src/lang/i18n";
import { Order, OrderStatus } from "../src/types/Order";
import { Item } from "../src/types/Item";
import FirestoreManager from "../src/services/FirestoreManager";

jest.mock("../src/services/FirestoreManager", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        queryOrder: jest
          .fn()
          .mockImplementation(() =>
            Promise.resolve([
              new Order(
                "user1",
                new Item(1, "mock item1", "description1", 10, 1, 1),
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
                new Item(2, "mock item2", "description1", 22, 1, 1),
                { latitude: 46.8182, longitude: 8.2275 },
                new Date(),
                OrderStatus.Delivered,
                new Date(),
                "Mattenhorn peak #1",
                "Pharmacy #5",
                { latitude: 55, longitude: 33 }
              ),
            ])
          ),
      };
    }),
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

beforeEach(() => {
  initI18n();
});

describe("OrderHistory", () => {
  it("renders correctly", async () => {
    const { getByText, getByTestId } = render(<OrderHistoryTest />);

    await waitFor(
      () => {
        expect(getByTestId("menu-button")).toBeTruthy();
        expect(getByTestId("x-button")).toBeTruthy();
        expect(getByTestId("x-icon")).toBeTruthy();
        expect(getByText("Order history")).toBeTruthy();
        expect(getByText("mock item1")).toBeTruthy();
        expect(getByText("10 CHF")).toBeTruthy();

        expect(getByText("mock item2")).toBeTruthy();
        expect(getByText("22 CHF")).toBeTruthy();
      },
      { timeout: 2000 }
    );
  });

  it("fails to fetch orders", async () => {
    (FirestoreManager as jest.Mock).mockImplementationOnce(() => ({
      queryOrder: jest.fn().mockReturnValue(null),
    }));

    const { getByText } = render(<OrderHistoryTest />);

    await waitFor(
      () => {
        expect(getByText("Failed to fetch from database.")).toBeTruthy();
      },
      { timeout: 2000 }
    );
  });

  it("returns empty orders", async () => {
    (FirestoreManager as jest.Mock).mockImplementationOnce(() => ({
      queryOrder: jest.fn().mockReturnValue([]),
    }));

    const { getByText } = render(<OrderHistoryTest />);

    await waitFor(
      () => {
        expect(
          getByText("No orders have been made yet. Go place some orders :)")
        ).toBeTruthy();
      },
      { timeout: 2000 }
    );
  });
});
