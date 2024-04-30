import React from "react";
import { render, act } from "@testing-library/react-native";
import LocationMarker from "../src/components/LocationMarker";
import { Animated } from "react-native";

jest.mock("expo-location", () => ({
  watchHeadingAsync: jest.fn(),
}));

describe("LocationMarker", () => {
  const { watchHeadingAsync } = require("expo-location");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with given coordinates", () => {
    const coordinate = { latitude: 37.78825, longitude: -122.4324 };
    const { getByTestId } = render(<LocationMarker coordinate={coordinate} />);
    expect(getByTestId("marker")).toBeTruthy();
  });

  it("initiates animations correctly", () => {
    jest.spyOn(Animated, "loop");

    const coordinate = { latitude: 37.78825, longitude: -122.4324 };
    render(<LocationMarker coordinate={coordinate} />);

    expect(Animated.loop).toHaveBeenCalled();
  });
});
