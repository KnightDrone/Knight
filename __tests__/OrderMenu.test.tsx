import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import OrderMenu from "../src/app/OrderMenu";
import { useFonts } from "../__mocks__/expo-font";

describe("Order Menu", () => {
  //set globally useFont to true
  beforeEach(() => {
    useFonts.mockReturnValue([true]);
  });

  it("renders correctly ", () => {
    const { getByText } = render(<OrderMenu />);

    expect(getByText("Choose your item")).toBeTruthy();
    expect(getByText("First aid kit")).toBeTruthy();
    expect(getByText("Thermal blanket")).toBeTruthy();
    expect(getByText("Flashlight")).toBeTruthy();
    expect(getByText("Power bank")).toBeTruthy();
  });

  it("does not render when fonts are not loaded", () => {
    useFonts.mockReturnValue([false]);
    const { queryByText } = render(<OrderMenu />);

    expect(queryByText("Choose your item")).toBeNull();
    expect(queryByText("First aid kit")).toBeNull();
    expect(queryByText("Thermal blanket")).toBeNull();
    expect(queryByText("Flashlight")).toBeNull();
    expect(queryByText("Power bank")).toBeNull();
  });

  it("handles button presses", () => {
    // Mock the console.log to test the onPress functionality
    const consoleSpy = jest.spyOn(console, "log");
    const { getByText } = render(<OrderMenu />);

    const firstAidButton = getByText("First aid kit");
    fireEvent.press(firstAidButton);
    expect(consoleSpy).toHaveBeenCalledWith("First aid kit");

    const thermalBlanketButton = getByText("Thermal blanket");
    fireEvent.press(thermalBlanketButton);
    expect(consoleSpy).toHaveBeenCalledWith("Thermal blanket");

    const flashlightButton = getByText("Flashlight");
    fireEvent.press(flashlightButton);
    expect(consoleSpy).toHaveBeenCalledWith("Flashlight");

    const powerBankButton = getByText("Power bank");
    fireEvent.press(powerBankButton);
    expect(consoleSpy).toHaveBeenCalledWith("Power bank");

    // Clean up the mock to ensure it doesn't affect other tests
    consoleSpy.mockRestore();
  });
});
