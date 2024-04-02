import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import OrderButton from "../src/components/OrderButton";
import { useFonts } from "../__mocks__/expo-font";

describe("Order Button Component", () => {
  it("does not render when fonts are not loaded", () => {
    useFonts.mockReturnValue([false]);

    // We use queryByText when the component can be null
    const { queryByText } = render(
      <OrderButton
        title="Test Button"
        image={require("../assets/images/splash.png")}
        onPress={() => {}}
      />
    );

    expect(queryByText("Test Button")).toBeNull();
  });

  it("renders correctly", () => {
    useFonts.mockReturnValue([true]);

    const onPressMock = jest.fn();
    const { getByText, getByTestId } = render(
      <OrderButton
        title="Test Button"
        image={require("../assets/images/splash.png")} // random image
        onPress={onPressMock}
      />
    );

    expect(getByText("Test Button")).toBeTruthy();

    expect(getByTestId("image")).toBeTruthy();

    fireEvent.press(getByText("Test Button"));
    expect(onPressMock).toHaveBeenCalled();
  });
});
