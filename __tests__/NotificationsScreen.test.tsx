import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import NotificationsScreen from "../src/app/settings/NotificationsScreen";
import { initI18n } from "../src/lang/i18n";

beforeAll(() => {
  initI18n();
});

describe("NotificationsScreen", () => {
  it("renders correctly", () => {
    const { getByText } = render(<NotificationsScreen />);

    expect(getByText("Order Tracking")).toBeTruthy();
    expect(getByText("Get periodic updates on your order")).toBeTruthy();

    expect(getByText("Discounts and Offers")).toBeTruthy();
    expect(
      getByText("Get notified when there are discounts and offers")
    ).toBeTruthy();

    expect(getByText("New Items")).toBeTruthy();
    expect(
      getByText("Get notified when there are new items available")
    ).toBeTruthy();
  });

  it("toggles switches correctly", () => {
    const { getByTestId } = render(<NotificationsScreen />);

    fireEvent(getByTestId("order-switch"), "onValueChange");
    fireEvent(getByTestId("offers-switch"), "onValueChange");
    fireEvent(getByTestId("item-switch"), "onValueChange");
  });
});
