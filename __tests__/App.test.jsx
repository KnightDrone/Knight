import React from "react";
import {
  screen,
  render,
  waitFor,
  fireEvent,
} from "@testing-library/react-native";
import { useFonts } from "../__mocks__/expo-font";
import * as Google from "expo-auth-session/providers/google";

import App from "../src/app/App";

beforeEach(() => {
  const mockPromptAsync = jest.fn();
  useFonts.mockReturnValue([true]);

  // Mock the Google authentication request setup
  Google.useAuthRequest.mockReturnValue([
    {}, // Mocked request
    { type: "success", params: { id_token: "mock-id-token" } }, // Mocked response
    mockPromptAsync, // Mocked promptAsync function
  ]);
});

// Avoid useless error messages
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

// 1. Navigation tests
describe("App Navigation", () => {
  it("renders the login screen as the initial route", () => {
    const {
      getByText,
      getByTestId,
      getByPlaceholderText,
      queryByTestId,
      queryByText,
    } = render(<App />);

    expect(getByTestId("login-screen")).toBeTruthy();
  });

  it("logs in when the login button is pressed", async () => {
    const {
      getByText,
      getByTestId,
      getByPlaceholderText,
      queryByTestId,
      queryByText,
    } = render(<App />);

    const emailInput = getByPlaceholderText("Enter your username or email");
    const passwordInput = getByPlaceholderText("Enter your password");

    fireEvent.changeText(emailInput, "random@gmail.com");
    fireEvent.changeText(passwordInput, "password");

    const loginButton = getByTestId("login-button");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(screen.queryByTestId("map-overview-screen")).toBeTruthy();
    });
  });
});
