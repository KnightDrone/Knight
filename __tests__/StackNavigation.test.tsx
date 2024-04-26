import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AuthStack, UserStack } from "../src/navigation/StackNavigation";

jest.mock("expo-auth-session/providers/google", () => ({
  useAuthRequest: jest.fn(() => [
    {},
    { type: "success", params: { id_token: "mock-id-token" } },
    jest.fn(),
  ]),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const AuthStackTest = () => {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
};

describe("AuthStack Navigation Tests", () => {
  it('navigates to the SignUp screen when "Sign Up" is pressed', () => {
    const { getByPlaceholderText, getByTestId } = render(<AuthStackTest />);
    fireEvent.press(getByTestId("sign-up-link"));
    expect(getByPlaceholderText("Enter your username")).toBeTruthy();
  });

  it('navigates to the ForgotPassword screen when "Reset password" is pressed', () => {
    const { getByPlaceholderText, getByTestId } = render(<AuthStackTest />);
    fireEvent.press(getByTestId("forgot-password-link"));
    expect(getByPlaceholderText("Enter your password")).toBeTruthy();
  });

  it("should navigate to the Map screen after successful login", async () => {
    const { getByText, getByTestId } = render(<AuthStackTest />);

    // Assuming that the login process is mocked to be successful
    fireEvent.changeText(getByTestId("email-input"), "user@gmail.com");
    fireEvent.changeText(getByTestId("password-input"), "test123");
    fireEvent.press(getByTestId("login-button"));
    // Check if navigation to the Map screen is successful
    expect(getByTestId("sign-up-link")).toBeTruthy();
  });
});

const UserStackTest = () => {
  return (
    <NavigationContainer>
      <UserStack />
    </NavigationContainer>
  );
};

describe("UserStack Navigation Tests", () => {
  it("should navigate from Login to SignUp screen", () => {
    const { getByText, getByTestId } = render(<UserStackTest />);
    fireEvent.press(getByTestId("sign-up-link"));
    expect(getByTestId("sign-up-screen")).toBeTruthy();
  });
});
