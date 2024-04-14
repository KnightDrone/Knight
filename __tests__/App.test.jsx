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
    const { getByTestId } = render(<App />);

    expect(getByTestId("login-screen")).toBeTruthy();
  });

  it("navigates to sign up screen when the sign up button is pressed", async () => {
    const { getByText } = render(<App />);
    const signUpButton = getByText("Sign Up!");
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(screen.queryByTestId("sign-up-screen")).toBeTruthy();
    });
  });

  it("navigates to forgot password screen when the forgot password button is pressed", async () => {
    const { getByText } = render(<App />);
    const forgotPasswordButton = getByText("Forgot your password?");
    fireEvent.press(forgotPasswordButton);

    await waitFor(() => {
      expect(screen.queryByTestId("forgot-password-screen")).toBeTruthy();
    });
  });

  it("logs in when the login button is pressed", async () => {
    const { getByTestId, getByPlaceholderText } = render(<App />);

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

  it("logs in, go to map overview, and then go to order menu", async () => {
    const { getByTestId, getByPlaceholderText } = render(<App />);

    const emailInput = getByPlaceholderText("Enter your username or email");
    const passwordInput = getByPlaceholderText("Enter your password");

    fireEvent.changeText(emailInput, "random@gmail.com");
    fireEvent.changeText(passwordInput, "password");

    const loginButton = getByTestId("login-button");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(screen.queryByTestId("map-overview-screen")).toBeTruthy();
    });

    const orderMenuButton = getByTestId("order-button");
    fireEvent.press(orderMenuButton);

    await waitFor(() => {
      expect(screen.queryByTestId("order-menu-screen")).toBeTruthy();
    });
  });

  it("goes to order menu, then goes back", async () => {
    const { getByTestId, getByPlaceholderText, getByText } = render(<App />);

    const emailInput = getByPlaceholderText("Enter your username or email");
    const passwordInput = getByPlaceholderText("Enter your password");

    fireEvent.changeText(emailInput, "random@gmail.com");
    fireEvent.changeText(passwordInput, "password");

    const loginButton = getByTestId("login-button");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(screen.queryByTestId("map-overview-screen")).toBeTruthy();
    });

    const orderMenuButton = getByTestId("order-button");
    fireEvent.press(orderMenuButton);

    await waitFor(() => {
      expect(screen.queryByTestId("order-menu-screen")).toBeTruthy();
    });

    const backButton = getByTestId("back-button");
    fireEvent.press(backButton);

    await waitFor(() => {
      expect(screen.queryByTestId("map-overview-screen")).toBeTruthy();
    });
  });

  it("goes to order menu, place an order and then goes to order placed", async () => {
    const { getByTestId, getByPlaceholderText, getByText } = render(<App />);

    const emailInput = getByPlaceholderText("Enter your username or email");
    const passwordInput = getByPlaceholderText("Enter your password");

    fireEvent.changeText(emailInput, "random@gmail.com");
    fireEvent.changeText(passwordInput, "password");

    const loginButton = getByTestId("login-button");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(screen.queryByTestId("map-overview-screen")).toBeTruthy();
    });

    const orderMenuButton = getByTestId("order-button");
    fireEvent.press(orderMenuButton);

    await waitFor(() => {
      expect(screen.queryByTestId("order-menu-screen")).toBeTruthy();
    });

    const placeOrderButton = getByText("First aid kit");
    fireEvent.press(placeOrderButton);

    const orderButton = getByText("Order");
    fireEvent.press(orderButton);

    await waitFor(() => {
      expect(screen.queryByTestId("order-placed-screen")).toBeTruthy();
    });
  });
});
