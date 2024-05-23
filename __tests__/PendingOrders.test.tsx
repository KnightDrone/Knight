import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import PendingOrders from "../src/app/order/PendingOrders";
import { Order, OrderStatus } from "../src/types/Order";
import { Item } from "../src/types/Item";
import FirestoreManager from "../src/services/FirestoreManager";
import * as Location from "expo-location";

jest.mock("../src/services/FirestoreManager", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        writeData: jest.fn().mockResolvedValue({}),
        queryData: jest.fn().mockResolvedValue([]),
        readData: jest.fn().mockResolvedValue({}),
        updateData: jest.fn().mockResolvedValue({}),
        deleteData: jest.fn().mockResolvedValue({}),
        getUser: jest.fn().mockResolvedValue({}),
        createUser: jest.fn().mockResolvedValue({}),
        deleteUser: jest.fn().mockResolvedValue({}),
        updateUser: jest.fn().mockResolvedValue({}),
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
                "abc",
                "St. Gallen Hospital",
                { latitude: 55, longitude: 33 },
                "1"
              ),
              new Order(
                "user2",
                new Item(2, "mock item2", "description1", 1, 1, 22),
                { latitude: 46.8182, longitude: 8.2275 },
                new Date(),
                OrderStatus.Delivered,
                new Date(),
                "Mattenhorn peak #1",
                "def",
                "Pharmacy #5",
                { latitude: 55, longitude: 33 },
                "2"
              ),
            ])
          ),
      };
    }),
  };
});

jest.mock("expo-location", () => {
  const originalModule = jest.requireActual("expo-location");
  return {
    __esModule: true,
    ...originalModule,
    requestForegroundPermissionsAsync: jest.fn(),
    watchPositionAsync: jest.fn(),
  };
});

describe("PendingOrders Component", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(<PendingOrders />);

    const pendingOrders = getByTestId("pending-orders-screen");
    expect(pendingOrders).toBeDefined();

    const orderList = getByTestId("order-list");
    expect(orderList).toBeDefined();
  });

  it("fetches orders", async () => {
    const { getByTestId } = render(<PendingOrders />);

    const orderList = getByTestId("order-list");
    expect(orderList).toBeDefined();

    await waitFor(() => {
      expect(getByTestId("order-card-1")).toBeDefined();
    });

    await waitFor(() => {
      const button = getByTestId("order-card-1-button");
      expect(button).toBeDefined();
      fireEvent.press(button);
    });

    await waitFor(() => {
      const closeButton = getByTestId("close-card-button");
      expect(closeButton).toBeDefined();
      fireEvent.press(closeButton);
    });
  });

  it("fails to fetch orders", async () => {
    (FirestoreManager as jest.Mock).mockImplementationOnce(() => ({
      queryOrder: jest.fn().mockReturnValue(null),
    }));

    const { getByText, getByTestId } = render(<PendingOrders />);

    await waitFor(
      () => {
        expect(getByTestId("error-box")).toBeTruthy();
        expect(getByText("Failed to fetch from database.")).toBeTruthy();
      },
      { timeout: 2000 }
    );

    fireEvent.press(getByTestId("error-box"));
  });

  it("returns empty orders", async () => {
    (FirestoreManager as jest.Mock).mockImplementationOnce(() => ({
      queryOrder: jest.fn().mockReturnValue([]),
    }));

    const { getByText, getByTestId } = render(<PendingOrders />);

    await waitFor(
      () => {
        expect(getByTestId("error-box")).toBeTruthy();
        expect(
          getByText("No orders pending orders at the moment, check back later.")
        ).toBeTruthy();
      },
      { timeout: 2000 }
    );
  });

  it("queryOrder throws an error", async () => {
    (FirestoreManager as jest.Mock).mockImplementationOnce(() => ({
      queryOrder: jest.fn().mockRejectedValue(new Error("Query failed.")),
    }));

    const { getByText, getByTestId } = render(<PendingOrders />);

    await waitFor(
      () => {
        expect(getByTestId("error-box")).toBeTruthy();
        expect(getByText("Query failed.")).toBeTruthy();
      },
      { timeout: 2000 }
    );
  });
});
