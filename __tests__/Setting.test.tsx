// Settings.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Settings from "../src/app/Setting"; // Adjust the import based on your file structure

describe("Settings Component", () => {
  it("contains correct sections and items", () => {
    const { getByTestId } = render(<Settings />);
    expect(getByTestId("Edit profile-button")).toBeTruthy();
    expect(getByTestId("Security-button")).toBeTruthy();
  });

  it("simulates pressing an item", () => {
    const handlePressMock = jest.fn();
    const { getByTestId } = render(<Settings onItemPress={handlePressMock} />);
    const securityButton = getByTestId("Security-button");
    fireEvent.press(securityButton);
    expect(handlePressMock).toHaveBeenCalledWith("Security");
  });

  it("checks icons and text for each item", () => {
    const { getByTestId, getByText } = render(<Settings />);
    expect(getByTestId("edit-icon")).toBeTruthy();
    expect(getByText("Edit profile")).toBeTruthy();
  });
});
