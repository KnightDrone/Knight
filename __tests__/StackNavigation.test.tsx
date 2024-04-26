import * as React from "react";
import { screen, render, fireEvent } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AuthStack, UserStack } from "../src/navigation/StackNavigation";

// Test for AuthStack
// =*=*=*=*=*=*=*=*=*

const AuthStackTest = () => {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
};

describe("AuthStack Navigation Tests", () => {
  test("navigates to the Login screen when app starts", () => {
    const { getByTestId } = render(<AuthStackTest />);
    // Check if the Login screen is displayed by looking for a specific text
    expect(getByTestId("login-screen")).toBeTruthy();
  });

  test('navigates to the SignUp screen when "Sign Up" is pressed', () => {
    render();
    fireEvent.press(screen.getByText("Sign Up"));
    // Check if the SignUp screen is displayed by looking for a specific text
    expect(screen.getByTestId("sign-up-screen")).toBeTruthy();
  });

  test('navigates to the ForgotPassword screen when "Forgot Password?" is pressed', () => {
    const { getByTestId } = render(<AuthStackTest />);
    fireEvent.press(getByTestId("forgot-password-link"));
    // Check if the ForgotPassword screen is displayed by looking for a specific text
    expect(screen.getByTestId("forgot-password-screen")).toBeTruthy();
  });
});

// =*=*=*=*=*=*=*=*=*
// Test for UserStack
// =*=*=*=*=*=*=*=*=*

const UserStackTest = () => {
  return (
    <NavigationContainer>
      <UserStack />
    </NavigationContainer>
  );
};

describe("UserStack Navigation Tests", () => {
  test("shows the Drawer when app starts", () => {
    const { getByTestId } = render(<UserStackTest />);
    // Check if the Drawer is displayed by looking for a specific text
    expect(getByTestId("map-view")).toBeTruthy();
  });

  test("navigates to OrderMenu when order button is pressed", () => {
    const { getByTestId } = render(<UserStackTest />);
    fireEvent.press(getByTestId("order-button"));
    // Check if the OrderMenu screen is displayed by looking for a specific text
    expect(screen.getByTestId("order-menu-screen")).toBeTruthy();
  });
});
