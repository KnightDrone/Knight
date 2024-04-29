import React from "react";
import { screen, fireEvent, render } from "@testing-library/react-native";
import { UserDrawer } from "../src/navigation/DrawerNavigation";

describe("UserDrawer Navigation Component", () => {
  it("renders the drawer navigation with initial route", () => {
    const { getByText } = render(<UserDrawer />);
    // Since Map is the initial route, we expect it to be rendered
    expect(getByText("Map")).toBeTruthy();
  });

  it("navigates to Profile and back to Map", () => {
    const { getByTestId, getByText } = render(<UserDrawer />);

    fireEvent.press(getByText("Profile"));
    expect(getByTestId("profile-screen")).toBeTruthy();

    fireEvent.press(getByTestId("profile-back-button"));
    expect(getByTestId("map-overview-screen")).toBeTruthy();
  });

  it("navigates to Settings and back to Map", () => {
    const { getByTestId, getByText } = render(<UserDrawer />);

    fireEvent.press(getByText("Settings"));
    expect(getByTestId("settings-screen")).toBeTruthy(); // Confirm Settings is opened

    // Use the testID to select the back button and simulate pressing it
    fireEvent.press(getByTestId("settings-back-button"));
    expect(getByTestId("map-overview-screen")).toBeTruthy();
  });
});
