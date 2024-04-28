import * as React from "react";
import { screen, render, fireEvent } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { UserStack, AuthStack } from "../src/navigation/StackNavigation";

jest.mock("../src/services/Firebase", () => ({
  auth: jest.fn(),
  GoogleAuthProvider: {
    credential: jest.fn(),
  },
  signInWithCredential: jest.fn(() =>
    Promise.resolve({ user: { uid: "12345" } })
  ),
  signInWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({ user: { uid: "12345" } })
  ),
}));

jest.mock("expo-auth-session/providers/google", () => ({
  useAuthRequest: jest.fn(() => [
    {}, // request
    { type: "success", params: { id_token: "fake_token" } }, // response
    jest.fn(), // promptAsync, simulating successful prompt
  ]),
}));

// =*=*=*=*=*=*=*=*=*
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
    const { getByTestId } = render(<AuthStackTest />);
    fireEvent.press(getByTestId("sign-up-link"));
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
});
