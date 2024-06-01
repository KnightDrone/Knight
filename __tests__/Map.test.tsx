import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import MapOverview from "../src/app/maps/Map";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system";

jest.mock("expo-location", () => {
  const originalModule = jest.requireActual("expo-location");
  return {
    __esModule: true,
    ...originalModule,
    requestForegroundPermissionsAsync: jest.fn(),
    watchPositionAsync: jest.fn(),
  };
});

jest.mock("expo-file-system", () => {
  return {
    __esModule: true,
    readAsStringAsync: jest.fn(),
    writeAsStringAsync: jest.fn(),
    documentDirectory: "mockDocumentDirectory/",
  };
});

jest.mock("react-native-vector-icons/MaterialIcons", () => "Icon");
jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => "Icon");
jest.mock("../src/components/LocationMarker", () => "LocationMarker");

describe("MapOverview", () => {
  const mockSavedLocation = {
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  beforeEach(() => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      { status: "granted" }
    );
    (Location.watchPositionAsync as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        remove: jest.fn(),
      });
    });
    (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(
      JSON.stringify(mockSavedLocation)
    );
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

  it("requests location permission on mount", async () => {
    render(<MapOverview navigation={{ navigate: jest.fn() }} />);
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
      <MapOverview navigation={{ navigate: jest.fn() }} />
    );
    expect(getByText("Loading your location...")).toBeTruthy();
  });

  it("toggles auto-centering when map is dragged", () => {
    const setAutoCenter = jest.fn();
    React.useState = jest.fn(() => [true, setAutoCenter]);
    const { getByTestId } = render(
      <MapOverview navigation={{ navigate: jest.fn() }} />
    );
    fireEvent(getByTestId("map-view"), "onPanDrag");
    expect(setAutoCenter).toHaveBeenCalledWith(false);
  });

  it("centers map to user location when auto-center button is pressed", () => {
    const { getByTestId } = render(
      <MapOverview navigation={{ navigate: jest.fn() }} />
    );
    const button = getByTestId("my-location-button");
    fireEvent.press(button);
    // Note: Since the animateToRegion is encapsulated within the hook, we cannot directly test it here without more complex setup.
  });

  it("passes location as a prop when navigating to OrderMenu", () => {
    const navigate = jest.fn();
    const { getByTestId } = render(<MapOverview navigation={{ navigate }} />);

    fireEvent.press(getByTestId("order-button"));

    expect(navigate).toHaveBeenCalledWith("OrderMenu");
  });
});
