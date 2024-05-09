import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import MapOverview from "../src/operator/OperatorMap";
import * as Location from "expo-location";

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

describe("OperatorMap Component", () => {
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
      <MapOverview navigation={{ navigate: jest.fn() }} />
    );
    expect(getByTestId("map-view")).toBeTruthy();
  });

  it("toggles auto-center when my-location button is pressed", () => {
    const { getByTestId } = render(
      <MapOverview navigation={{ navigate: jest.fn() }} />
    );
    const locationButton = getByTestId("my-location-button");
    fireEvent.press(locationButton);
  });

  it("navigates to settings when order button is pressed", () => {
    const navigateMock = jest.fn();
    const { getByTestId } = render(
      <MapOverview navigation={{ navigate: navigateMock }} />
    );
    const orderButton = getByTestId("order-button");
    fireEvent.press(orderButton);
    expect(navigateMock).toHaveBeenCalledWith("Settings");
  });

  it("shows loading indicator when location is loading", () => {
    const { getByText } = render(
      <MapOverview navigation={{ navigate: jest.fn() }} />
    );
    expect(getByText("Loading your location...")).toBeTruthy();
  });
});
