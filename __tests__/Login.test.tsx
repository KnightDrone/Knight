import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import Login from "../src/app/Login";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../src/services/firebase";
import * as Google from "expo-auth-session/providers/google";

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  // Add other navigation actions as needed
};
const mockPromptAsync = jest.fn(() => Promise.resolve({ type: "success" }));

jest.mock("firebase/auth", () => ({
  GoogleAuthProvider: {
    credential: jest.fn(),
  },
  signInWithCredential: jest.fn(),
}));

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
  useAuthRequest: jest.fn(() => {
    const mockPromptAsync = jest.fn(() => Promise.resolve({ type: "success" }));
    const request = {};
    const response = {};
    return [request, response, mockPromptAsync];
  }),
}));
/*jest.mock("expo-auth-session/providers/google", () => ({
  useAuthRequest: jest.fn(),
}));*/

describe("Login", () => {
  it("renders correctly", () => {
    const { getByText, getByPlaceholderText } = render(
      <Login promptAsync={() => {}} />
    );
    const emailInput = getByPlaceholderText("Enter your username or email");
    const passwordInput = getByPlaceholderText("Enter your password");
    const loginButton = getByText("Log in");

    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(loginButton).toBeTruthy();
  });

  it("displays an error message when the credentials are invalid", () => {
    const { getByText, getByPlaceholderText } = render(
      <Login promptAsync={() => {}} />
    );
    const emailInput = getByPlaceholderText("Enter your username or email");
    const passwordInput = getByPlaceholderText("Enter your password");
    const loginButton = getByText("Log in");

    fireEvent.changeText(emailInput, "wrongemail");
    fireEvent.changeText(passwordInput, "wrongpassword");
    fireEvent.press(loginButton);

    const errorMessage = getByText("Invalid credentials");
    expect(errorMessage).toBeTruthy();
  });
  it("logs in with Google when the Google login button is pressed", async () => {
    const promptAsyncMock = jest.fn().mockResolvedValue({
      type: "success",
      params: {
        id_token: "mock-id-token",
      },
    });
    const { getByText } = render(<Login promptAsync={promptAsyncMock} />);

    const googleLoginButton = getByText("Continue with Google");
    fireEvent.press(googleLoginButton);

    expect(promptAsyncMock).toHaveBeenCalled();
    expect(GoogleAuthProvider.credential).toHaveBeenCalledWith("mock-id-token");
    expect(signInWithCredential).toHaveBeenCalledWith(auth, expect.anything());
  });
});

describe("Login Component", () => {
  it("renders correctly", () => {
    const { getByText, getByPlaceholderText } = render(
      <Login navigation={{}} />
    );
    expect(getByText("Login to Wild Knight")).toBeTruthy();
    expect(getByPlaceholderText("Enter your username or email")).toBeTruthy();
    expect(getByPlaceholderText("Enter your password")).toBeTruthy();
  });

  it("updates email and password fields correctly", () => {
    const { getByPlaceholderText } = render(<Login navigation={{}} />);
    const emailInput = getByPlaceholderText("Enter your username or email");
    const passwordInput = getByPlaceholderText("Enter your password");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");

    expect(emailInput.props.value).toBe("test@example.com");
    expect(passwordInput.props.value).toBe("password123");
  });

  it("shows error when trying to log in with empty fields", () => {
    const { getByText } = render(<Login navigation={{}} />);
    const loginButton = getByText("Log in");

    fireEvent.press(loginButton);
    expect(getByText("Please input email and password.")).toBeTruthy();
  });

  it("calls logInWithEmail when the Log in button is pressed", () => {
    const mockLogInWithEmail = jest.fn();
    const { getByText } = render(<Login navigation={{}} />);
    const loginButton = getByText("Log in");

    // Mock the logInWithEmail method
    jest
      .spyOn(Login.prototype, "logInWithEmail")
      .mockImplementation(mockLogInWithEmail);

    fireEvent.press(loginButton);

    expect(mockLogInWithEmail).toHaveBeenCalled();
  });

  it("navigates to the Map screen after successful login", async () => {
    const mockLogInWithEmail = jest.fn(() => Promise.resolve({ user: {} }));
    const mockNavigation = { navigate: jest.fn() };
    const { getByText } = render(<Login navigation={mockNavigation} />);

    // Mock the logInWithEmail method
    jest
      .spyOn(Login.prototype, "logInWithEmail")
      .mockImplementation(mockLogInWithEmail);

    const loginButton = getByText("Log in");
    fireEvent.press(loginButton);

    // Wait for any async actions to complete
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith("Map");
    });
  });

  it('navigates to ForgotPassword screen when "Forgot password?" is pressed', () => {
    const mockNavigation = { navigate: jest.fn() };
    const { getByText } = render(<Login navigation={mockNavigation} />);
    const forgotPasswordLink = getByText("Forgot your password?");

    fireEvent.press(forgotPasswordLink);

    expect(mockNavigation.navigate).toHaveBeenCalledWith("ForgotPassword");
  });

  it('navigates to SignUp screen when "Sign Up" is pressed', () => {
    const mockNavigation = { navigate: jest.fn() };
    const { getByText } = render(<Login navigation={mockNavigation} />);
    const signUpLink = getByText("Sign Up!");

    fireEvent.press(signUpLink);

    expect(mockNavigation.navigate).toHaveBeenCalledWith("SignUp");
  });
  it("toggles password visibility when the visibility icon is pressed", () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Login navigation={mockNavigation} />
    );
    const passwordInput = getByPlaceholderText("Enter your password");
    const togglePasswordVisibilityButton = getByTestId("showPasswordButton");

    // Initially, the password should be hidden
    expect(passwordInput.props.secureTextEntry).toBe(true);

    // Press the visibility icon
    fireEvent.press(togglePasswordVisibilityButton);

    // The password should now be visible
    expect(passwordInput.props.secureTextEntry).toBe(false);

    // Press the visibility icon again
    fireEvent.press(togglePasswordVisibilityButton);

    // The password should be hidden again
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  /* We replace the expo-auth-session/providers/google module with a mock module. 
     We're providing a mock implementation for useAuthRequest that returns a mock promptAsync function, 
     as well as request and response as empty objects. This way, we can test the Google sign-in process 
     without making actual requests to Google's servers.
  */
  it("initiates Google sign-in process on button press", () => {
    const { getByText } = render(<Login navigation={mockNavigation} />);
    const googleSignInButton = getByText("Continue with Google");

    fireEvent.press(googleSignInButton);

    // Check if the promptAsync function was called, indicating that the Google sign-in process was initiated
    const [, , promptAsync] = Google.useAuthRequest();
    expect(promptAsync).toHaveBeenCalled();
  });
});
