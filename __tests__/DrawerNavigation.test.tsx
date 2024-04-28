import React from "react";
import { screen, fireEvent, render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { UserDrawer } from "../src/navigation/DrawerNavigation";

jest.mock("react-native-vector-icons/Ionicons", () => "Icon");

const UserDrawerTest = (
  <NavigationContainer>
    <UserDrawer />
  </NavigationContainer>
);

describe("UserDrawer Navigation Component", () => {
  it("renders the drawer navigation with initial route", () => {
    const { getByText } = render(UserDrawerTest);
    // Since Map is the initial route, we expect it to be rendered
    expect(getByText("Map")).toBeTruthy();
  });

  it("navigates to Profile and back to Map", () => {
    const { getByTestId, getByText } = render(UserDrawerTest);

    fireEvent.press(getByText("Profile"));
    expect(getByText("Profile")).toBeTruthy();

    fireEvent.press(getByTestId("back-button"));
    expect(getByText("Map")).toBeTruthy();
  });

  it("navigates to Settings and back to Map", () => {
    const { getByTestId, getByText } = render(UserDrawerTest);

    fireEvent.press(getByText("Settings"));
    expect(getByText("Settings")).toBeTruthy(); // Confirm Settings is opened

    // Use the testID to select the back button and simulate pressing it
    fireEvent.press(getByTestId("back-button"));
    expect(getByText("Map")).toBeTruthy(); // Confirm we navigated back to Map
  });

  it("checks the functionality of the DrawerContentComponent", () => {
    const { getByTestId } = render(UserDrawerTest);

    // // Assuming you have testIDs for your drawer items, if not, add them in your DrawerContent
    // const drawerItem = getByTestId("map-overview-screen");
    // fireEvent.press(drawerItem); // This test assumes you have added testIDs to your drawer items
    // expect(getByTestId("map-screen")).toBeTruthy(); // Ensure that the correct screen is displayed
  });
});
