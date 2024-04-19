import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ItemCard from "../src/components/ItemCard";
import { Item } from "../src/types/Item";
import { useFonts } from "../__mocks__/expo-font";
import { View, Text } from "react-native";

// Avoid useless error messages
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

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

describe("ItemCard", () => {
  beforeEach(() => {
    useFonts.mockReturnValue([true]);
  });

  const mockHandleClose = jest.fn();
  const mockHandleOrder = jest.fn();
  const imageDir = "../assets/images/splash.png";
  const image = require(imageDir);
  const mockItem = new Item(
    1,
    "Test Item",
    "Test Description",
    image,
    // imageDir,
    image,
    // imageDir,
    10
  );

  it("renders correctly when isVisible is true", () => {
    const { getByTestId } = render(
      <ItemCard
        isVisible={true}
        handleClose={mockHandleClose}
        handleOrder={mockHandleOrder}
        item={mockItem}
      />
    );

    expect(getByTestId("close-button")).toBeTruthy();
    expect(getByTestId("close-icon")).toBeTruthy();
    expect(getByTestId("blur-view")).toBeTruthy();
    expect(getByTestId("item-image")).toBeTruthy();
  });

  it("does not render when isVisible is false", () => {
    const { queryByTestId } = render(
      <ItemCard
        isVisible={false}
        handleClose={mockHandleClose}
        handleOrder={mockHandleOrder}
        item={mockItem}
      />
    );

    expect(queryByTestId("close-button")).toBeNull();
  });

  it("calls handleClose when close button is pressed", () => {
    const { getByTestId } = render(
      <ItemCard
        isVisible={true}
        handleClose={mockHandleClose}
        handleOrder={mockHandleOrder}
        item={mockItem}
      />
    );

    fireEvent.press(getByTestId("close-button"));
    expect(mockHandleClose).toHaveBeenCalled();
  });
});
