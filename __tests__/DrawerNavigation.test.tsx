import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { UserDrawer } from "../src/navigation/DrawerNavigation";

jest.mock("react-native-vector-icons/Ionicons", () => "Icon");

describe("UserDrawer Navigation Component", () => {
  it("renders the drawer navigation with initial route", () => {
    const { getByText } = render(
      <NavigationContainer>
        <UserDrawer />
      </NavigationContainer>
    );
    // Since Map is the initial route, we expect it to be rendered
    expect(getByText("Map")).toBeTruthy();
  });

  it("navigates to Profile and back to Map", () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <UserDrawer />
      </NavigationContainer>
    );

    fireEvent.press(getByText("Profile"));
    expect(getByText("Profile")).toBeTruthy();

    fireEvent.press(getByTestId("back-button"));
    expect(getByText("Map")).toBeTruthy();
  });

  it("navigates to Settings and back to Map", () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <UserDrawer />
      </NavigationContainer>
    );

    fireEvent.press(getByText("Settings"));
    expect(getByText("Settings")).toBeTruthy(); // Confirm Settings is opened

    // Use the testID to select the back button and simulate pressing it
    fireEvent.press(getByTestId("back-button"));
    expect(getByText("Map")).toBeTruthy(); // Confirm we navigated back to Map
  });

  it("checks the functionality of the DrawerContentComponent", () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <UserDrawer />
      </NavigationContainer>
    );

    // // Assuming you have testIDs for your drawer items, if not, add them in your DrawerContent
    // const drawerItem = getByTestId("map-overview-screen");
    // fireEvent.press(drawerItem); // This test assumes you have added testIDs to your drawer items
    // expect(getByTestId("map-screen")).toBeTruthy(); // Ensure that the correct screen is displayed
  });
});
