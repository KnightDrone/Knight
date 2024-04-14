import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import MapOverview from "../src/app/Map";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

jest.mock("react-native-maps", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: jest
      .fn()
      .mockImplementation((props) => <View {...props} testID="mapView" />),
    Marker: jest.fn().mockImplementation(() => null),
  };
});

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn() as jest.Mock,
  getCurrentPositionAsync: jest.fn() as jest.Mock,
}));

jest.mock("react-native", () => {
  const actualReactNative = jest.requireActual("react-native");
  return {
    ...actualReactNative,
    Alert: {
      alert: jest.fn(),
    },
  };
});

describe("MapOverview Component", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<MapOverview />);
    expect(getByTestId("mapView")).toBeTruthy();
  });

  it("navigates to OrderMenu when order button is pressed", () => {
    const navigation = useNavigation();
    const { getByText } = render(<MapOverview />);
    fireEvent.press(getByText("Order"));
    expect(navigation.navigate).toHaveBeenCalledWith("OrderMenu");
  });

  it("updates region and marker on successful location fetch", async () => {
    const fakeLocation = {
      coords: {
        latitude: 34.0522,
        longitude: -118.2437,
        altitude: 0,
        accuracy: 5,
        altitudeAccuracy: 5,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    // Mock the permission request to be granted
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      {
        status: "granted",
      }
    );

    // Mock getting the current location to return fakeLocation
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue(
      fakeLocation
    );

    const { getByTestId } = render(<MapOverview />);

    // Invoke the location fetch action
    const locationButton = getByTestId("locationButton"); // Ensure your button has the 'testID' prop
    fireEvent.press(locationButton);

    // Wait for the effects to apply
    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
    });

    // Check if the map region and marker have been updated
    expect(getByTestId("mapView").props.region).toEqual({
      latitude: fakeLocation.coords.latitude,
      longitude: fakeLocation.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });

    // Assuming Marker component is also receiving the updated props
    expect(getByTestId("mapMarker").props.coordinate).toEqual({
      latitude: fakeLocation.coords.latitude,
      longitude: fakeLocation.coords.longitude,
    });
  });
});
