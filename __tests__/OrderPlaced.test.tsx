import React from "react";
import {
  fireEvent,
  render,
  waitFor,
  screen,
  act,
} from "@testing-library/react-native";
import OrderPlaced from "../src/app/OrderPlaced";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native";
import { RootStackParamList } from "../src/types/RootStackParamList";
import { useFonts } from "../__mocks__/expo-font";
import { Item } from "../src/types/Item";
import { read } from "fs";

type OrderPlacedStack = {
  OrderPlaced: RootStackParamList["OrderPlaced"];
  OrderHistory: RootStackParamList["OrderHistory"];
};

const Stack = createStackNavigator<OrderPlacedStack>();
useFonts.mockReturnValue([true]);

jest.mock("../src/components/PayButton", () => ({
  __esModule: true,
  PayButton: () => {
    return (
      <View testID="mocked-pay-button">
        <Text>MockedPayButton</Text>
      </View>
    );
  },
}));

beforeAll(() => {
  global.alert = jest.fn();

  // Avoid useless error messages
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

jest.mock("../src/services/FirestoreManager", () => {
  readOrder: jest.fn().mockReturnValue({
    getItem: jest
      .fn()
      .mockReturnValue(new Item(1, "Test Item", "Test Description", 100)),
    getOrderDate: jest.fn().mockReturnValue(new Date()),
    getOrderLocation: jest.fn().mockReturnValue({ latitude: 0, longitude: 0 }),
  });
});

const OrderPlacedTest = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"OrderPlaced"}>
        <Stack.Screen
          name="OrderPlaced"
          initialParams={{
            orderId: "1",
          }}
        >
          {(props) => <OrderPlaced {...props} />}
        </Stack.Screen>
        <Stack.Screen name="OrderHistory">
          {(props) => (
            <View testID="order-history-screen">Order History Screen</View>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe("OrderPlaced", () => {
  beforeAll(() => {
    useFonts.mockReturnValue([true]);
  });

  it("renders correctly", () => {
    // Render the component
    const { getByTestId } = render(<OrderPlacedTest />);

    const orderPlacedMessage = getByTestId("order-placed-message");
    expect(orderPlacedMessage).toBeTruthy();
    const arrivalTime = getByTestId("arrival-time");
    expect(arrivalTime).toBeTruthy();
    const loading = getByTestId("loading-bar");
    expect(loading).toBeTruthy();
    const orderSummary = getByTestId("order-summary");
    expect(orderSummary).toBeTruthy();
    const orderedItemName = getByTestId("ordered-item-name");
    expect(orderedItemName).toBeTruthy();
    // const userLocation = getByTestId("user-location");
    // expect(userLocation).toBeTruthy();
    const orderedItemImage = getByTestId("ordered-item-image");
    expect(orderedItemImage).toBeTruthy();
  });

  it("goes in useEffect", async () => {
    // Render the component
    const { getByTestId } = render(<OrderPlacedTest />);
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      const loading = getByTestId("loading-bar");
      expect(loading).toBeTruthy();
    });
  });

  it("goes to view order history", async () => {
    // Render the component
    const { getByTestId } = render(<OrderPlacedTest />);

    const orderHistory = getByTestId("view-order-history");
    expect(orderHistory).toBeTruthy();

    fireEvent.press(orderHistory);
    await waitFor(() =>
      expect(screen.getByTestId("order-history-screen")).toBeTruthy()
    );
  });

  it("navigates to Order History", async () => {
    const { getByTestId } = render(<OrderPlacedTest />);
    const viewOrderHistory = getByTestId("view-order-history");
    fireEvent.press(viewOrderHistory);
    await waitFor(() =>
      expect(screen.getByTestId("order-history-screen")).toBeTruthy()
    );
  });

  it("updates completion over time", () => {
    jest.useFakeTimers();
    const { getByTestId } = render(<OrderPlacedTest />);

    const loadingBar = getByTestId("loading-bar");
    const width = loadingBar.props.style.width.replace("%", "");
    const parsedWidth = parseInt(width, 10);
    expect(parsedWidth).toBeLessThanOrEqual(0);

    act(() => {
      jest.advanceTimersByTime(100_000); // Advance by 100 second
    });

    const newWidth = loadingBar.props.style.width.replace("%", "");
    const newParsedWidth = parseInt(newWidth, 10);
    expect(newParsedWidth).toBeGreaterThan(parsedWidth);

    act(() => {
      jest.advanceTimersByTime(4_000_000); // Advance by 4000 second (more than 1 hour)
    });

    const newerWidth = loadingBar.props.style.width.replace("%", "");
    const newerParsedWidth = parseInt(newerWidth, 10);
    expect(newerParsedWidth).toBeGreaterThan(newParsedWidth);

    const orderComplete = getByTestId("order-complete");
    expect(orderComplete).toBeTruthy();
    const orderCompleteMessage = getByTestId("order-complete-message");
    expect(orderCompleteMessage).toBeTruthy();
    // const reportIssue = getByTestId("report-issue");
    // expect(reportIssue).toBeTruthy();
  });
});
