import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import PendingOrders from "../src/app/order/PendingOrders";
import { Order, OrderStatus } from "../src/types/Order";
import { Item } from "../src/types/Item";
import FirestoreManager from "../src/services/FirestoreManager";
import * as Location from "expo-location";

let mockOrders: Order[] = [
  new Order(
    "user1",
    new Item(1, "mock item1", "description1", 1, 1, 10),
    { latitude: 46.8182, longitude: 8.2275 },
    new Date(),
    OrderStatus.Pending,
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
    OrderStatus.Pending,
    new Date(),
    "Mattenhorn peak #1",
    "def",
    "Pharmacy #5",
    { latitude: 55, longitude: 33 },
    "2"
  ),
];

// Mock the entire Firebase module
jest.mock("../src/services/Firebase", () => {
  return {
    __esModule: true,
    firestore: jest.fn(),
    collection: jest.fn(),
    onSnapshot: jest.fn(),
    auth: {
      currentUser: {
        uid: "user1",
        displayName: "geronimo",
      },
    },
  };
});

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({
    status: "granted",
  }),
  watchPositionAsync: jest.fn().mockImplementation((options, callback) => {
    callback({
      coords: {
        latitude: 37.789,
        longitude: -122.4324,
      },
    });
    return {
      remove: jest.fn(),
    };
  }),
  Accuracy: {
    BestForNavigation: 5,
  },
}));

jest.mock("../src/services/FirestoreManager", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        writeData: jest.fn().mockImplementation((collection, order) => {
          // Mock implementation for writeData to update order status
          if (order.getStatus() === OrderStatus.Accepted) {
            // Update the order status in the mock orders array
            mockOrders = mockOrders.filter((o) => o.getId() !== order.getId());
          }
          return Promise.resolve({});
        }),
        queryOrder: jest.fn().mockResolvedValue(mockOrders),
      };
    }),
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

  it("fetches orders and displays them", async () => {
    const { getByTestId } = render(<PendingOrders />);

    await waitFor(() => {
      expect(getByTestId("order-card-1")).toBeDefined();
      expect(getByTestId("order-card-2")).toBeDefined();
    });
  });

  it("handles order acceptance", async () => {
    const { getByTestId, queryByTestId, getByText } = render(<PendingOrders />);

    await waitFor(() => {
      const button = getByTestId("order-card-1-button");
      expect(button).toBeDefined();
      fireEvent.press(button);
    });

    await waitFor(() => {
      const acceptButton = getByText("Accept Order");
      expect(acceptButton).toBeDefined();
      fireEvent.press(acceptButton);
    });

    // await waitFor(() => {
    //   expect(queryByTestId("order-card-1")).toBeNull();
    // });
  });

  it("shows error when fetching orders fails", async () => {
    (FirestoreManager as jest.Mock).mockImplementationOnce(() => ({
      queryOrder: jest.fn().mockReturnValue(null),
    }));

    const { getByText, getByTestId } = render(<PendingOrders />);

    await waitFor(() => {
      expect(getByTestId("error-box")).toBeTruthy();
      expect(getByText("Failed to fetch from database.")).toBeTruthy();
    });

    fireEvent.press(getByTestId("error-box"));
  });

  it("shows message when no pending orders are found", async () => {
    (FirestoreManager as jest.Mock).mockImplementationOnce(() => ({
      queryOrder: jest.fn().mockReturnValue([]),
    }));

    const { getByText, getByTestId } = render(<PendingOrders />);

    await waitFor(() => {
      expect(getByTestId("error-box")).toBeTruthy();
      expect(
        getByText("No orders pending orders at the moment, check back later.")
      ).toBeTruthy();
    });
  });

  it("handles queryOrder rejection", async () => {
    (FirestoreManager as jest.Mock).mockImplementationOnce(() => ({
      queryOrder: jest.fn().mockRejectedValue(new Error("Query failed.")),
    }));

    const { getByText, getByTestId } = render(<PendingOrders />);

    await waitFor(() => {
      expect(getByTestId("error-box")).toBeTruthy();
      expect(getByText("Query failed.")).toBeTruthy();
    });
  });
});
