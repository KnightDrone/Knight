import React from "react";
import { act, render } from "@testing-library/react-native";
import PendingOrders from "../src/app/PendingOrders";

describe("PendingOrders Component", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(<PendingOrders />);

    const pendingOrders = getByTestId("pending-orders-screen");
    expect(pendingOrders).toBeDefined();

    const menuButton = getByTestId("menu-button");
    expect(menuButton).toBeDefined();
    const menuIcon = getByTestId("menu-icon");
    expect(menuIcon).toBeDefined();

    const pendingOrdersTitle = getByTestId("pending-orders-title");
    expect(pendingOrdersTitle).toBeDefined();

    const closeButton = getByTestId("close-button");
    expect(closeButton).toBeDefined();
    const closeIcon = getByTestId("close-icon");
    expect(closeIcon).toBeDefined();

    const orderList = getByTestId("order-list");
    expect(orderList).toBeDefined();
  });

  it.only("fetches orders", () => {
    jest.useFakeTimers();
    const { getByTestId } = render(<PendingOrders />);

    act(() => {
      jest.advanceTimersByTime(10_000); // 10s
    });

    const orderList = getByTestId("order-list");
    expect(orderList).toBeDefined();

    const orderItems = orderList.children;
    expect(orderItems).toHaveLength(2);
  });
});
