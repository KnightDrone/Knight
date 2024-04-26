import React from "react";
import { screen, render, fireEvent } from "@testing-library/react-native";
import OrderMenu from "../src/app/OrderMenu";
import { productButtons } from "../src/types/ProductButtons";
import { View, Text } from "react-native";

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

describe("Order Menu", () => {
  //set globally useFont to true
  beforeEach(() => {
    useFonts.mockReturnValue([true]);
  });

describe("Order Menu", () => {
  it("renders correctly ", () => {
    const { getByText, getByTestId } = render(<OrderMenu />);

    expect(getByTestId("order-menu-text")).toBeTruthy();
    productButtons.forEach((button) => {
      expect(getByText(button.item.getName())).toBeTruthy();
    });
  });

  it("opens card when button is pressed", () => {
    const { getByText } = render(<OrderMenu />);
    const button = productButtons[0];
    fireEvent.press(getByText(button.item.getName()));

    expect(
      screen.getByTestId(`item-card-view-${button.item.getId()}`)
    ).toBeTruthy();
  });

  it("closes card when close button is pressed", () => {
    const { getByText, queryByTestId } = render(<OrderMenu />);
    const button = productButtons[0];
    fireEvent.press(getByText(button.item.getName()));
    fireEvent.press(screen.getByTestId("close-button"));

    expect(queryByTestId(`item-card-view-${button.item.getId()}`)).toBeNull();
  });

  it("opens only one card at a time", () => {
    const { getByText, queryByTestId } = render(<OrderMenu />);
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
    const { getByText } = render(<OrderMenu />);
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
