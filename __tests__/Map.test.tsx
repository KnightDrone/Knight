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
});
