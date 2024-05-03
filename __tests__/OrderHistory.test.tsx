import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import OrderHistory from "../src/app/OrderHistory";
import { RootStackParamList } from "../src/types/RootStackParamList";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
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

  it("navigates back", async () => {
    const mockNavigation = {
      goBack: jest.fn(),
    };

    const mockRoute: RouteProp<RootStackParamList, "OrderHistory"> = {
      key: "OrderHistory",
      name: "OrderHistory",
      params: {
        historyOp: false,
        userId: "user1",
      },
    };

    const { getByTestId } = render(
      <OrderHistory
        navigation={
          mockNavigation as unknown as StackNavigationProp<OrderHistoryStack>
        }
        route={mockRoute}
      />
    );

    await waitFor(() => {
      expect(getByTestId("x-button")).toBeTruthy();
    });

    const xButton = getByTestId("x-button");
    fireEvent.press(xButton);

    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
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
