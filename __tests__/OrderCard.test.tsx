import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import OrderCard from "../src/components/cards/OrderCard";
import { Order } from "../src/types/Order";
import { Item } from "../src/types/Item";

describe("OrderCard", () => {
  const image = require("../assets/images/splash.png");
  const item = new Item(1, "Test Item", "Test Description", 10, image, image);
  const location = { latitude: 0, longitude: 0 };
  const order = new Order("John Doe", item, location);

  it("renders correctly", () => {
    const { getByText } = render(<OrderCard order={order} opBool={false} />);

    expect(getByText("Test Item")).toBeTruthy();
    expect(getByText("Lat: 0, Long: 0")).toBeTruthy();
    expect(getByText("10 CHF")).toBeTruthy();
  });

  it("calls onClick when pressed", () => {
    const mockOnClick = jest.fn();
    const { getByText } = render(
      <OrderCard order={order} onClick={mockOnClick} opBool={false} />
    );

    fireEvent.press(getByText("Test Item"));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it("does not call onClick when not provided", () => {
    const { getByText } = render(<OrderCard order={order} opBool={false} />);

    fireEvent.press(getByText("Test Item"));
    // No error should be thrown
  });

  it("displays the correct date", () => {
    const { getByText } = render(<OrderCard order={order} opBool={false} />);

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
