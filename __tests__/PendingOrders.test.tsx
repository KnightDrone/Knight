import React from "react";
import { act, render } from "@testing-library/react-native";
import PendingOrders from "../src/app/PendingOrders";
import { Order, OrderStatus } from "../src/types/Order";
import { Item } from "../src/types/Item";
import queryOrder from "../src/services/FirestoreManager";

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
                new Item(1, "mock item1", "description1", 1, 1, 10),
                { latitude: 46.8182, longitude: 8.2275 },
                new Date(),
                OrderStatus.Delivered,
                new Date(),
                "Mattenhorn peak #3",
                "St. Gallen Hospital",
                { latitude: 55, longitude: 33 }
              ),
              new Order(
                "user2",
                new Item(2, "mock item2", "description1", 1, 1, 22),
                { latitude: 46.8182, longitude: 8.2275 },
                new Date(),
                OrderStatus.Delivered,
                new Date(),
                "Mattenhorn peak #1",
                "Pharmacy #5",
                { latitude: 55, longitude: 33 }
              ),
            ])
          ),
      };
    }),
  };
});

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
