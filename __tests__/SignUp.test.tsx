import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import SignUp from "../src/app/SignUp"; // Adjust the import path to your SignUp component

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
// Mock navigation and Google auth
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));
jest.mock("expo-auth-session/providers/google", () => ({
  useAuthRequest: jest.fn(),
}));
// Mock promptAsync
const mockPromptAsync = jest.fn();

describe("SignUp Component (Basic)", () => {
  it("renders correctly", () => {
    const { getByText, getByPlaceholderText } = render(
      <SignUp navigation={{}} />
    );
    expect(getByText("Wild Knight")).toBeTruthy();
    expect(getByPlaceholderText("Enter your username")).toBeTruthy();
    expect(getByPlaceholderText("Enter your email")).toBeTruthy();
    expect(getByPlaceholderText("Enter your password")).toBeTruthy();
  });

  it("updates username, email and password fields correctly", () => {
    const { getByPlaceholderText } = render(<SignUp navigation={{}} />);
    const usernameInput = getByPlaceholderText("Enter your username");
    const emailInput = getByPlaceholderText("Enter your email");
    const passwordInput = getByPlaceholderText("Enter your password");

    fireEvent.changeText(usernameInput, "testuser");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");

    expect(usernameInput.props.value).toBe("testuser");
    expect(emailInput.props.value).toBe("test@example.com");
    expect(passwordInput.props.value).toBe("password123");
  });

  it("displays password strength and suggestions correctly", () => {
    const { getByPlaceholderText, getByText } = render(
      <SignUp navigation={{}} />
    );
    const passwordInput = getByPlaceholderText("Enter your password");

    fireEvent.changeText(passwordInput, "password123");
    expect(getByText("Password Strength: Moderate")).toBeTruthy();
    expect(getByText("Include at least one special character")).toBeTruthy();

    fireEvent.changeText(passwordInput, "password123!");
    expect(getByText("Password Strength: Strong")).toBeTruthy();
  });

  it("displays password strength and suggestions correctly", () => {
    const { getByPlaceholderText, getByText } = render(
      <SignUp navigation={{}} />
    );
    const passwordInput = getByPlaceholderText("Enter your password");
    fireEvent.changeText(passwordInput, "pass");
    expect(getByText("Password Strength:")).toBeTruthy();
    expect(
      getByText("Password should be at least 8 characters long") // Still need to make sure we display suggestions within component
    ).toBeTruthy();
  });
  it("shows error when trying to sign up with empty fields", () => {
    const { getByText } = render(<SignUp navigation={{}} />);
    const signUpButton = getByText("Sign Up");

    fireEvent.press(signUpButton);
    expect(getByText("Please input email and password.")).toBeTruthy();
  });
});

// TODO: Add more tests for successful sign up, Google sign in, navigation on successful sign up, etc.
describe("SignUp Component (Extended)", () => {
  it("toggles password visibility when the visibility icon is pressed", () => {
    const { getByTestId } = render(<SignUp navigation={{}} />);
    const visibilityToggle = getByTestId("eye-icon");

    // Initial state should be 'password' (hidden)
    expect(visibilityToggle.props.name).toBe("eye-slash");

    fireEvent.press(visibilityToggle);

    // After toggle, password should be visible
    expect(visibilityToggle.props.name).toBe("eye");

    fireEvent.press(visibilityToggle);

    // Toggle back to hidden
    expect(visibilityToggle.props.name).toBe("eye-slash");
  });

  it("calls signUpWithEmail when the Sign Up button is pressed", () => {
    const mockSignUpWithEmail = jest.fn();
    const { getByText } = render(<SignUp navigation={{}} />);
    const signUpButton = getByText("Sign Up");

    // Mock the signUpWithEmail method
    jest
      .spyOn(SignUp.prototype, "signUpWithEmail")
      .mockImplementation(mockSignUpWithEmail);

    fireEvent.press(signUpButton);

    expect(mockSignUpWithEmail).toHaveBeenCalled();
  });

  it("navigates to the Login screen after successful sign up", async () => {
    const mockSignUpWithEmail = jest.fn(() => Promise.resolve({ user: {} }));
    const mockNavigation = { navigate: jest.fn() };
    const { getByText } = render(<SignUp navigation={mockNavigation} />);

    // Mock the signUpWithEmail method
    jest
      .spyOn(SignUp.prototype, "signUpWithEmail")
      .mockImplementation(mockSignUpWithEmail);

    const signUpButton = getByText("Sign Up");
    fireEvent.press(signUpButton);

    // Wait for any async actions to complete
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith("Login");
    });
  });
});
