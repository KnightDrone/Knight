import React from "react";
import {
  screen,
  render,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import Login from "../src/app/Login";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../src/services/firebase";

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  // Add other navigation actions as needed
};

describe("Login Component", () => {
  it("allows email login", async () => {
    const { getByPlaceholderText, getByText, queryByTestId } = render(
      <LoginTest />
    );

    fireEvent.changeText(
      getByPlaceholderText("Enter your username or email"),
      "test@example.com"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter your password"),
      "password123"
    );

    fireEvent.press(getByText("Log in"));

    expect(signInWithEmailAndPassword).toHaveBeenCalled();
    await waitFor(() => expect(queryByTestId("map-screen")).toBeTruthy());
  });

  it("sets showPassword to true when the eye icon is pressed", () => {
    const { getByPlaceholderText, getAllByTestId } = render(<LoginTest />);
    const passwordToggles = getAllByTestId("password-toggle");
    const passwordToggle = passwordToggles[1]; // Select the second password-toggle
    fireEvent.press(passwordToggle);
    expect(
      getByPlaceholderText("Enter your password").props.secureTextEntry
    ).toBe(false);
  });

  it("calls login when login button is pressed", async () => {
    const { getByText } = render(<LoginTest />);

    fireEvent.press(getByText("Log in"));
    expect(signInWithEmailAndPassword).toHaveBeenCalled();
  });

  it("navigates to the forgot password screen when the link is pressed", async () => {
    const { getByTestId } = render(<LoginTest />);

    fireEvent.press(getByTestId("forgot-password-link"));
    await waitFor(() =>
      expect(screen.queryByTestId("forgot-password-screen")).toBeTruthy()
    );
  });

  it("navigates to the sign up screen when the link is pressed", async () => {
    const { getByTestId } = render(<LoginTest />);

    fireEvent.press(getByTestId("sign-up-link"));
    await waitFor(() =>
      expect(screen.queryByTestId("sign-up-screen")).toBeTruthy()
    );
  });

  // it("catches signInWithEmailAndPassword error", async () => { });

  // it("sets error for invalid credentials (signInWithEmailAndPassword has no user object)", async () => { });

  it("handles Google login correctly", async () => {
    const mockNavigate = jest.fn();
    const { getByText } = render(<LoginTest />);

    fireEvent.press(getByText("Continue with Google"));

    expect(Google.useAuthRequest()[2]).toHaveBeenCalled();
    expect(GoogleAuthProvider.credential).toHaveBeenCalled();
    expect(signInWithCredential).toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.queryByTestId("map-screen")).toBeTruthy()
    );
  });
});
