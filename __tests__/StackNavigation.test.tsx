import * as React from "react";
import { screen, render, fireEvent } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AuthStack, UserStack } from "../src/navigation/StackNavigation";

// Test for AuthStack
describe("AuthStack Navigation Tests", () => {
  test('navigates to the SignUp screen when "Sign Up" is pressed', () => {
    render();
    fireEvent.press(screen.getByText("Sign Up"));
    // Check if the SignUp screen is displayed by looking for a specific text
    expect(screen.getByText("Create Account")).toBeTruthy();
  });
  test('navigates to the ForgotPassword screen when "Forgot Password?" is pressed', () => {
    render(
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    );
    fireEvent.press(screen.getByText("Forgot Password?"));
    // Check if the ForgotPassword screen is displayed by looking for a specific text
    expect(screen.getByText("Reset Password")).toBeTruthy();
  });
});
// Test for UserStack
describe("UserStack Navigation Tests", () => {
  test("shows the Drawer when app starts", () => {
    render(
      <NavigationContainer>
        <UserStack />
      </NavigationContainer>
    );
    // Check if the Drawer is displayed by looking for a specific text
    expect(screen.getByText("Home")).toBeTruthy();
  });
  test('navigates to the OrderMenu screen when "Order Menu" is pressed', () => {
    render(
      <NavigationContainer>
        <UserStack />
      </NavigationContainer>
    );
    fireEvent.press(screen.getByText("Order Menu"));
    // Check if the OrderMenu screen is displayed by looking for a specific text
    expect(screen.getByText("Menu")).toBeTruthy();
  });
  test('navigates to the OrderPlaced screen when "Place Order" is pressed', () => {
    render(
      <NavigationContainer>
        <UserStack />
      </NavigationContainer>
    );
    fireEvent.press(screen.getByText("Place Order"));
    // Check if the OrderPlaced screen is displayed by looking for a specific text
    expect(screen.getByText("Order Confirmation")).toBeTruthy();
  });
});
