import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import Login from "../src/app/Login";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../src/firebase";

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  // Add other navigation actions as needed
};
const mockPromptAsync = jest.fn(() => Promise.resolve({ type: 'success' }));

jest.mock("firebase/auth", () => ({
    GoogleAuthProvider: {
      credential: jest.fn(),
    },
    signInWithCredential: jest.fn(),
  }));
  

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
// Mock navigation and Google auth
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));
jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: jest.fn(),
}));

describe("Login", () => {
    it("renders correctly", () => {
        const { getByText, getByPlaceholderText } = render(<Login promptAsync={() => {}} />);
        const emailInput = getByPlaceholderText('Enter your username or email');
        const passwordInput = getByPlaceholderText('Enter your password');
        const loginButton = getByText('Log in');

        expect(emailInput).toBeTruthy();
        expect(passwordInput).toBeTruthy();
        expect(loginButton).toBeTruthy();
    });

    it("displays an error message when the credentials are invalid", () => {
        const { getByText, getByPlaceholderText } = render(<Login promptAsync={() => {}} />);
        const emailInput = getByPlaceholderText('Enter your username or email');
        const passwordInput = getByPlaceholderText('Enter your password');
        const loginButton = getByText('Log in');

        fireEvent.changeText(emailInput, 'wrongemail');
        fireEvent.changeText(passwordInput, 'wrongpassword');
        fireEvent.press(loginButton);

        const errorMessage = getByText('Invalid credentials');
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

describe('Login Component', () => {
  it('updates email and password fields correctly', () => {
    const { getByPlaceholderText } = render(<Login promptAsync={() => {}} />);
    const emailInput = getByPlaceholderText('Enter your username or email');
    const passwordInput = getByPlaceholderText('Enter your password');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('navigates to ForgotPassword screen on "Forgot password?" press', () => {
    const { getByText } = render(<Login promptAsync={() => {}} />);
    const forgotPasswordLink = getByText('Forgot password?');
    fireEvent.press(forgotPasswordLink);
    // Assuming you have access to the mock navigation object
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ForgotPassword');
  });
  it('navigates to SignUp screen on "Sign Up!" press', () => {
    const { getByText } = render(<Login promptAsync={() => {}} />);
    const signUpLink = getByText('Sign Up!');
    fireEvent.press(signUpLink);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('SignUp');
  });

  it('initiates Google sign-in process on button press', () => {
    const { getByText } = render(<Login promptAsync={() => {}} />);
    const googleSignInButton = getByText('Continue with Google');
    fireEvent.press(googleSignInButton);
    // Assuming promptAsync is mocked to check if it's called
    expect(mockPromptAsync).toHaveBeenCalled();
  });
});
