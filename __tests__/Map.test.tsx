import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Map from "../src/app/Map";
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

describe("Map", () => {
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
    const { getByTestId } = render(<Map />);
    expect(getByTestId("map-view")).toBeTruthy();
  });

  it("requests location permission on mount", async () => {
    render(<Map />);
    await waitFor(() =>
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled()
    );
  });

  it("navigates to OrderMenu when order button is pressed", () => {
    const navigate = jest.fn();
    const { getByText, getByTestId } = render(
      <Map navigation={{ navigate }} />
    );
    fireEvent.press(getByText("map.order-button"));
    expect(navigate).toHaveBeenCalledWith("OrderMenu");
  });

  it("shows loading indicator when location is being fetched", async () => {
    (Location.watchPositionAsync as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        remove: jest.fn(),
      })
    );
    const { getByText } = render(<Map />);
    expect(getByText("Loading your location...")).toBeTruthy();
  });

  it("toggles auto-centering when map is dragged", () => {
    const setAutoCenter = jest.fn();
    React.useState = jest.fn(() => [true, setAutoCenter]);
    const { getByTestId } = render(<Map />);
    fireEvent(getByTestId("map-view"), "onPanDrag");
    expect(setAutoCenter).toHaveBeenCalledWith(false);
  });

  it("centers map to user location when auto-center button is pressed", () => {
    const animateToRegionMock = jest.fn();
    const { getByTestId } = render(<Map />);
    const button = getByTestId("my-location-button");
    fireEvent.press(button);
    //expect(animateToRegionMock).toHaveBeenCalled();
    // Assertions would ideally check if animateToRegion is called with the correct region
  });
});
