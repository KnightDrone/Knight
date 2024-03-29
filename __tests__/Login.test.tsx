import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import LoginScreen from "../src/app/Login";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../src/firebase";


jest.mock("firebase/auth", () => ({
    GoogleAuthProvider: {
      credential: jest.fn(),
    },
    signInWithCredential: jest.fn(),
  }));
  
describe("LoginScreen", () => {
    it("renders correctly", () => {
        const { getByText, getByPlaceholderText } = render(<LoginScreen promptAsync={() => {}} />);
        const emailInput = getByPlaceholderText('Enter your username or email');
        const passwordInput = getByPlaceholderText('Enter your password');
        const loginButton = getByText('Log in');

        expect(emailInput).toBeTruthy();
        expect(passwordInput).toBeTruthy();
        expect(loginButton).toBeTruthy();
    });

    it("displays an error message when the credentials are invalid", () => {
        const { getByText, getByPlaceholderText } = render(<LoginScreen promptAsync={() => {}} />);
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
        const { getByText } = render(<LoginScreen promptAsync={promptAsyncMock} />);
    
        const googleLoginButton = getByText("Continue with Google");
        fireEvent.press(googleLoginButton);
    
        expect(promptAsyncMock).toHaveBeenCalled();
        expect(GoogleAuthProvider.credential).toHaveBeenCalledWith("mock-id-token");
        expect(signInWithCredential).toHaveBeenCalledWith(auth, expect.anything());
      });
});