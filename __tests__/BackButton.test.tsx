import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import BackButton from "../src/components/buttons/BackButton";

describe("BackButton", () => {
  const mockOnPress = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders correctly", () => {
    const { getByTestId } = render(
      <BackButton onPress={mockOnPress} testID="back-button" />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });
  it("calls the onPress handler when pressed", () => {
    const { getByTestId } = render(
      <BackButton onPress={mockOnPress} testID="back-button" />
    );
    const button = getByTestId("back-button");
    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
  it("displays the correct icon", () => {
    const { getByTestId } = render(
      <BackButton onPress={mockOnPress} testID="back-button" />
    );
    const icon = getByTestId("back-button").findByProps({ name: "menu" });
    expect(icon.props.name).toBe("menu");
  });
});
