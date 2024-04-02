import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import OrderMenu from "../src/app/OrderMenu";
import { useFonts } from "../__mocks__/expo-font";

describe("Order Menu", () => {
  it("renders correctly ", () => {
    useFonts.mockReturnValue([true]);
    const { getByText } = render(<OrderMenu />);

    expect(getByText("Choose your item")).toBeTruthy();
    expect(getByText("First Aid Kit")).toBeTruthy();
    expect(getByText("Thermal Blanket")).toBeTruthy();
    expect(getByText("Flashlight")).toBeTruthy();
    expect(getByText("Power Bank")).toBeTruthy();
  });

  it("handles button presses", () => {
    useFonts.mockReturnValue([true]);
    // Mock the console.log to test the onPress functionality
    const consoleSpy = jest.spyOn(console, "log");
    const { getByText } = render(<OrderMenu />);

    const firstAidButton = getByText("First Aid Kit");
    fireEvent.press(firstAidButton);
    expect(consoleSpy).toHaveBeenCalledWith("First Aid Kit");

    const thermalBlanketButton = getByText("Thermal Blanket");
    fireEvent.press(thermalBlanketButton);
    expect(consoleSpy).toHaveBeenCalledWith("Thermal Blanket");

    const flashlightButton = getByText("Flashlight");
    fireEvent.press(flashlightButton);
    expect(consoleSpy).toHaveBeenCalledWith("Flashlight");

    const powerBankButton = getByText("Power Bank");
    fireEvent.press(powerBankButton);
    expect(consoleSpy).toHaveBeenCalledWith("Power Bank");

    // Clean up the mock to ensure it doesn't affect other tests
    consoleSpy.mockRestore();
  });
});
