import React from "react";
import { screen, render, fireEvent } from "@testing-library/react-native";
import OrderMenu from "../src/app/OrderMenu";
import { useFonts } from "../__mocks__/expo-font";
import { productButtons } from "../src/types/ProductButtons";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../src/types/RootStackParamList";

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
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

type OrderPlacedStack = {
  OrderMenu: RootStackParamList["OrderMenu"];
  OrderPlaced: RootStackParamList["OrderPlaced"];
};

const Stack = createStackNavigator<OrderPlacedStack>();

const OrderMenuTest = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"OrderMenu"}>
        <Stack.Screen
          name="OrderMenu"
          initialParams={{
            latitude: -999,
            longitude: -999,
          }}
        >
          {(props) => <OrderMenu {...props} />}
        </Stack.Screen>
        <Stack.Screen name="OrderPlaced">
          {(props) => <View testID="order-placed">Order Placed Screen</View>}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe("Order Menu", () => {
  //set globally useFont to true
  beforeEach(() => {
    useFonts.mockReturnValue([true]);
  });

  it("renders correctly ", () => {
    const { getByText, getByTestId } = render(<OrderMenuTest />);

    expect(getByTestId("order-menu-text")).toBeTruthy();
    productButtons.forEach((button) => {
      expect(getByText(button.item.getName())).toBeTruthy();
    });
  });

  it("does not render when fonts are not loaded", () => {
    useFonts.mockReturnValue([false]);
    const { queryByText } = render(<OrderMenuTest />);

    productButtons.forEach((button) => {
      expect(queryByText(button.item.getName())).toBeNull();
    });
  });

  it("opens card when button is pressed", () => {
    const { getByText } = render(<OrderMenuTest />);
    const button = productButtons[0];
    fireEvent.press(getByText(button.item.getName()));

    expect(
      screen.getByTestId(`item-card-view-${button.item.getId()}`)
    ).toBeTruthy();
  });

  it("closes card when close button is pressed", () => {
    const { getByText, queryByTestId } = render(<OrderMenuTest />);
    const button = productButtons[0];
    fireEvent.press(getByText(button.item.getName()));
    fireEvent.press(screen.getByTestId("close-button"));

    expect(queryByTestId(`item-card-view-${button.item.getId()}`)).toBeNull();
  });

  it("opens only one card at a time", () => {
    const { getByText, queryByTestId } = render(<OrderMenuTest />);
    const button = productButtons[0];
    const button2 = productButtons[1];
    fireEvent.press(getByText(button.item.getName()));
    fireEvent.press(getByText(button2.item.getName()));

    expect(queryByTestId(`item-card-view-${button.item.getId()}`)).toBeNull();
    expect(
      screen.getByTestId(`item-card-view-${button2.item.getId()}`)
    ).toBeTruthy();
  });

  it("can open and close every card", () => {
    const { getByText } = render(<OrderMenuTest />);
    productButtons.forEach((button) => {
      fireEvent.press(getByText(button.item.getName()));
      expect(
        screen.getByTestId(`item-card-view-${button.item.getId()}`)
      ).toBeTruthy();
      fireEvent.press(screen.getByTestId("close-button"));
      expect(
        screen.queryByTestId(`item-card-view-${button.item.getId()}`)
      ).toBeNull();
    });
  });
});
