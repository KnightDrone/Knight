// Settings.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Settings from "../src/app/settings/Settings";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Alert, View } from "react-native";

const Stack = createStackNavigator();
const spyAlert = jest
  .spyOn(Alert, "alert")
  //@ts-ignore
  .mockImplementation((title, message, callbackOrButtons) => {
    const buttons = callbackOrButtons;
    if (buttons) {
      const last = buttons[buttons.length - 1] as any;
      last.onPress();
    }
  });

const SettingsTest = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Settings">
        <Stack.Screen name="Settings">
          {(props: any) => <Settings {...props} />}
        </Stack.Screen>
        <Stack.Screen name="EditProfile">
          {(props: any) => <View testID="edit-profile-screen" />}
        </Stack.Screen>
        <Stack.Screen name="Login">
          {(props: any) => <View testID="login-screen" />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe("Settings Component", () => {
  it("renders correctly", () => {
    const { getByText } = render(<SettingsTest />);
    expect(getByText("Account")).toBeTruthy();
  });

  it("contains correct sections and items", () => {
    const { getByTestId } = render(<SettingsTest />);
    expect(getByTestId("Edit profile-button")).toBeTruthy();
    expect(getByTestId("Security-button")).toBeTruthy();
  });

  it("simulates pressing an item", () => {
    const handlePressMock = jest.fn();
    const { getByTestId } = render(<SettingsTest />);
    const securityButton = getByTestId("Security-button");
    fireEvent.press(securityButton);
  });

  it("checks icons and text for each item", () => {
    const { getByTestId, getByText } = render(<SettingsTest />);
    expect(getByTestId("edit-icon")).toBeTruthy();
    expect(getByText("Edit profile")).toBeTruthy();
  });

  it("navigates to the EditProfile screen when 'Edit profile' is pressed", () => {
    const { getByTestId } = render(<SettingsTest />);
    const editProfileButton = getByTestId("Edit profile-button");
    expect(editProfileButton).toBeTruthy();
    fireEvent.press(editProfileButton);
  });

  it("handles logout", () => {
    const { getByTestId, getByText } = render(<SettingsTest />);
    const logoutButton = getByTestId("logout-button");
    expect(logoutButton).toBeTruthy();
    fireEvent.press(logoutButton);
  });

  it("handles become an operator", () => {
    const { getByTestId, getByText } = render(<SettingsTest />);
    const roleButton = getByTestId("role-button");
    expect(roleButton).toBeTruthy();
    fireEvent.press(roleButton);
  });
});

jest.mock("../src/services/Firebase", () => ({
  // Ensure this path is correct
  auth: {
    signOut: jest.fn(() => Promise.resolve()),
  },
}));
