import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import OrderButton from "../src/components/OrderButton";
import { useFonts } from "../__mocks__/expo-font";

describe("Order Button Component", () => {
  //set globally useFont to true
  beforeEach(() => {
    useFonts.mockReturnValue([true]);
  });

  it("renders correctly", () => {
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
