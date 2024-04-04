import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import OrderButton from "../src/components/OrderButton";
import { useFonts } from "../__mocks__/expo-font";

describe("Order Button Component", () => {
  
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
