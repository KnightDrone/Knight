import * as React from "react";
import { useFonts } from "../__mocks__/expo-font";
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

const UserStackTest = () => (
  <NavigationContainer>
    <UserStack />
  </NavigationContainer>
);
describe("UserStack Navigation Tests", () => {
  test("initially shows the MapOverview screen when the app starts", () => {
    const { getByTestId } = render(<UserStackTest />);
    expect(getByTestId("map-overview-screen")).toBeTruthy();
  });
  test("navigates to OrderPlaced when the place order button is pressed", () => {
    const { getByTestId } = render(<UserStackTest />);
    fireEvent.press(getByTestId("order-button")); // Assuming you have a button with this testID
    expect(getByTestId("order-menu-screen")).toBeTruthy();
  });

  test("goes back from OrderMenu when back button is pressed", () => {
    const { getByTestId } = render(<UserStackTest />);
    // Navigate to OrderMenu first
    fireEvent.press(getByTestId("order-button")); // This needs to navigate to OrderMenu
    // Now press the back button in OrderMenu
    fireEvent.press(getByTestId("back-button"));
    // Check if it navigated back to the previous screen (assuming MapOverview)
    expect(getByTestId("map-overview-screen")).toBeTruthy();
  });
});
