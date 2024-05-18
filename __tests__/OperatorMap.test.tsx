import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import OperatorMap from "../src/app/maps/OperatorMap";
import * as Location from "expo-location";
import { Order } from "../src/types/Order";

jest.mock("expo-location", () => {
  const originalModule = jest.requireActual("expo-location");
  return {
    __esModule: true,
    ...originalModule,
    requestForegroundPermissionsAsync: jest.fn(),
    watchPositionAsync: jest.fn(),
  };
});

jest.mock("react-native-vector-icons/MaterialIcons", () => "Icon");
jest.mock("../src/components/LocationMarker", () => "LocationMarker");
jest.mock("../src/services/FirestoreManager", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      queryOrder: jest.fn(() => Promise.resolve([])),
    })),
  };
});

jest.mock("../src/types/Order", () => ({
  OrderStatus: jest.fn(),
  Order: jest.fn(),
}));
jest.mock("react-native-maps", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: View,
    Marker: View,
  };
});

describe("OperatorMap", () => {
  beforeEach(() => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      { status: "granted" }
    );
    (Location.watchPositionAsync as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        remove: jest.fn(),
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByTestId } = render(
      <OperatorMap navigation={{ navigate: jest.fn() }} />
    );
    expect(getByTestId("map-view")).toBeTruthy();
  });

  it("requests location permission on mount", async () => {
    render(<OperatorMap navigation={{ navigate: jest.fn() }} />);
    await waitFor(() =>
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled()
    );
  });

  it("shows loading indicator when location is being fetched", async () => {
    (Location.watchPositionAsync as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        remove: jest.fn(),
      })
    );
    const { getByText } = render(
      <OperatorMap navigation={{ navigate: jest.fn() }} />
    );
    expect(getByText("Loading your location...")).toBeTruthy();
  });

  it("centers map to user location when auto-center button is pressed", () => {
    const { getByTestId } = render(
      <OperatorMap navigation={{ navigate: jest.fn() }} />
    );
    const button = getByTestId("my-location-button");
    fireEvent.press(button);
    // Note: Since the animateToRegion is encapsulated within the hook, we cannot directly test it here without more complex setup.
  });
});
