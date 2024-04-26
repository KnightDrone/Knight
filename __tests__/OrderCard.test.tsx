import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import OrderCard from "../src/components/OrderCard";
import { Order, OrderStatus } from "../src/types/Order";
import { Item } from "../src/types/Item";

describe("OrderCard", () => {
  const image = require("../assets/images/splash.png");
  const item = new Item(1, "Test Item", "Test Description", image, image, 10);
  const location = { latitude: 0, longitude: 0 };
  const order = new Order("John Doe", item, location);

  it("renders correctly", () => {
    const { getByText } = render(<OrderCard order={order} />);

    expect(getByText("Test Item")).toBeTruthy();
    expect(getByText("Lat: 0, Long: 0")).toBeTruthy();
    expect(getByText("10 CHF")).toBeTruthy();
  });

  it("calls onClick when pressed", () => {
    const mockOnClick = jest.fn();
    const { getByText } = render(
      <OrderCard order={order} onClick={mockOnClick} />
    );

    fireEvent.press(getByText("Test Item"));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it("does not call onClick when not provided", () => {
    const { getByText } = render(<OrderCard order={order} />);

    fireEvent.press(getByText("Test Item"));
    // No error should be thrown
  });

  it("displays the correct date", () => {
    const { getByText } = render(<OrderCard order={order} />);

    const date = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const expectedDate = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    expect(getByText(expectedDate)).toBeTruthy();
  });
});