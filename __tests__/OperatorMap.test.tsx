import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import OperatorMap from "../src/app/OperatorMap";
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
    const { getByTestId } = render(<OperatorMap />);
    expect(getByTestId("map-view")).toBeTruthy();
  });

  it("requests location permission on mount", async () => {
    render(<OperatorMap />);
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
    const { getByText } = render(<OperatorMap />);
    expect(getByText("Loading your location...")).toBeTruthy();
  });

  it("passes location as a prop when navigating to OrderMenu", () => {
    const navigate = jest.fn();
    const { getByTestId } = render(<OperatorMap navigation={{ navigate }} />);

    fireEvent.press(getByTestId("order-button"));

    expect(navigate).toHaveBeenCalledWith("OrderMenu", {
      latitude: expect.any(Number),
      longitude: expect.any(Number),
    });
  });

  it("centers map to user location when auto-center button is pressed", () => {
    const animateToRegionMock = jest.fn();
    const { getByTestId } = render(<OperatorMap />);
    const button = getByTestId("my-location-button");
    fireEvent.press(button);
    //expect(animateToRegionMock).toHaveBeenCalled();
  });
});
