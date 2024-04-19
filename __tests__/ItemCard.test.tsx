import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ItemCard from "../src/components/ItemCard";
import { Item } from "../src/types/Item";
import { useFonts } from "../__mocks__/expo-font";

// Avoid useless error messages
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

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
    expect(getByTestId("price-text")).toBeTruthy();
    expect(getByTestId("order-button")).toBeTruthy();
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

  it("calls handleOrder when order button is pressed", () => {
    const { getByTestId } = render(
      <ItemCard
        isVisible={true}
        handleClose={mockHandleClose}
        handleOrder={mockHandleOrder}
        item={mockItem}
      />
    );

    fireEvent.press(getByTestId("order-button"));
    expect(mockHandleOrder).toHaveBeenCalled();
  });
});
