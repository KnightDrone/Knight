import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import OrderHistory from "../src/app/order/OrderHistory";
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
                "abc",
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
                "def",
                "Pharmacy #5",
                { latitude: 55, longitude: 33 }
              ),
            ])
          ),
      };
    }),
  };
});

jest.mock("../src/services/Firebase", () => {
  return {
    auth: {
      currentUser: {
        uid: "user1",
      },
    },
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

    const { getByText, getByTestId } = render(<OrderHistoryTest />);

    await waitFor(
      () => {
        expect(getByTestId("error-box")).toBeTruthy();
        expect(getByText("Failed to fetch from database.")).toBeTruthy();
      },
      { timeout: 2000 }
    );

    fireEvent.press(getByTestId("error-box"));
  });

  it("returns empty orders", async () => {
    (FirestoreManager as jest.Mock).mockImplementationOnce(() => ({
      queryOrder: jest.fn().mockReturnValue([]),
    }));

    const { getByText, getByTestId } = render(<OrderHistoryTest />);

    await waitFor(
      () => {
        expect(getByTestId("error-box")).toBeTruthy();
        expect(
          getByText("No orders have been made yet. Go place some orders :)")
        ).toBeTruthy();
      },
      { timeout: 2000 }
    );
  });

  it("queryOrder throws an error", async () => {
    (FirestoreManager as jest.Mock).mockImplementationOnce(() => ({
      queryOrder: jest.fn().mockRejectedValue(new Error("Query failed.")),
    }));

    const { getByText, getByTestId } = render(<OrderHistoryTest />);

    await waitFor(
      () => {
        expect(getByTestId("error-box")).toBeTruthy();
        expect(getByText("Query failed.")).toBeTruthy();
      },
      { timeout: 2000 }
    );
  });
});
