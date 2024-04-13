import React from "react";
import { screen, render, fireEvent } from "@testing-library/react-native";
import OrderMenu from "../src/app/OrderMenu";
import { useFonts } from "../__mocks__/expo-font";
import { productButtons } from "../src/types/ProductButtons";

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

  // add button press test
});
