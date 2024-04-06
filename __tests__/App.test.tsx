import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import App from "../src/app/App";
import { useFonts } from "../__mocks__/expo-font";

describe("App", () => {
  //set globally useFont to true
  beforeEach(() => {
    useFonts.mockReturnValue([true]);
  });

  it("renders OrderMenu", () => {
    render(<App />);
    expect(screen.getByText("Choose your item")).toBeTruthy();

    // Check if all buttons are rendered
    expect(screen.getByText("First aid kit")).toBeTruthy();
    expect(screen.getByText("Flashlight")).toBeTruthy();
    expect(screen.getByText("Thermal blanket")).toBeTruthy();
    expect(screen.getByText("Power bank")).toBeTruthy();

  });
});
