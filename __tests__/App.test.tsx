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
import { onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

beforeEach(() => {
  const mockPromptAsync = jest.fn();
  useFonts.mockReturnValue([true]);

  // Mock the Google authentication request setup, makes the user sign in automatically with google
  (Google.useAuthRequest as jest.Mock).mockReturnValue([
    {}, // Mocked request
    { type: "success", params: { id_token: "mock-id-token" } }, // Mocked response
    mockPromptAsync, // Mocked promptAsync function
  ]);
});

beforeAll(() => {
  global.alert = jest.fn();

  // Avoid useless error messages
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("App Navigation", () => {
  it("renders the login screen as the initial route", () => {
    const { getByTestId } = render(<App />);

    expect(getByTestId("login-screen")).toBeTruthy();
  });

  it("directly logs in with Google due to the mock implementation", async () => {
    const { getByTestId } = render(<App />);
    await waitFor(() => {
      expect(screen.queryByTestId("map-overview-screen")).toBeTruthy();
    });
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
    (Google.useAuthRequest as jest.Mock).mockReturnValue([
      {},
      { type: "fail", params: { id_token: "" } },
      jest.fn(),
    ]);

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
    (Google.useAuthRequest as jest.Mock).mockReturnValue([
      {},
      { type: "fail", params: { id_token: "" } },
      jest.fn(),
    ]);

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

  it("onAuthStateChanged is called when the user logs in", async () => {
    const mockUser = { uid: "123", email: "random@gmail.com" };
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    const { getByPlaceholderText, getByTestId } = render(<App />);

    await waitFor(() => {
      expect(screen.queryByTestId("map-overview-screen")).toBeTruthy();
      expect(onAuthStateChanged).toHaveBeenCalled();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@user",
        JSON.stringify(mockUser)
      );
    });
  });

  it("onAuthChanged is called when the user logs out", async () => {
    //mock null user (logged out)
    const mockUser = null;
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    const { getByTestId } = render(<App />);
    await waitFor(() => {
      expect(screen.queryByTestId("map-overview-screen")).toBeTruthy();
      expect(onAuthStateChanged).toHaveBeenCalled();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("@user");
    });
  });

  it("alerts due to setItem error", async () => {
    const mockUser = {
      uid: "123",
      email: "random@gmail.com",
    };
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    // Mock the AsyncStorage error
    (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
      new Error("AsyncStorage error")
    );

    const { getByPlaceholderText, getByTestId } = render(<App />);
    await waitFor(() => {
      expect(screen.queryByTestId("map-overview-screen")).toBeTruthy();
      expect(onAuthStateChanged).toHaveBeenCalled();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@user",
        JSON.stringify(mockUser)
      );
      expect(alert).toHaveBeenCalledWith(new Error("AsyncStorage error"));
    });
  });

  it("alerts due to removeItem error", async () => {
    const mockUser = null;
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    // Mock the AsyncStorage error
    (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(
      new Error("AsyncStorage error")
    );

    const { getByTestId } = render(<App />);
    await waitFor(() => {
      expect(screen.queryByTestId("map-overview-screen")).toBeTruthy();
      expect(onAuthStateChanged).toHaveBeenCalled();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("@user");
      expect(alert).toHaveBeenCalledWith(new Error("AsyncStorage error"));
    });
  });

  it("navigates back to login screen when the sign up back button is pressed", async () => {
    (Google.useAuthRequest as jest.Mock).mockReturnValue([
      {},
      { type: "fail", params: { id_token: "" } },
      jest.fn(),
    ]);

    const { getByText, getByTestId } = render(<App />);
    const signUpButton = getByText("Sign Up!");
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(screen.queryByTestId("sign-up-screen")).toBeTruthy();
    });

    const signUpBackButton = getByTestId("sign-up-back-button");
    fireEvent.press(signUpBackButton);

    await waitFor(() => {
      expect(screen.queryByTestId("login-screen")).toBeTruthy();
    });
  });

  it("navigates back to login screen when the forgot password back button is pressed", async () => {
    (Google.useAuthRequest as jest.Mock).mockReturnValue([
      {},
      { type: "fail", params: { id_token: "" } },
      jest.fn(),
    ]);

    const { getByText, getByTestId } = render(<App />);
    const forgotPasswordButton = getByText("Forgot your password?");
    fireEvent.press(forgotPasswordButton);

    await waitFor(() => {
      expect(screen.queryByTestId("forgot-password-screen")).toBeTruthy();
    });

    const forgotPasswordBackButton = getByTestId("forgot-password-back-button");
    fireEvent.press(forgotPasswordBackButton);

    await waitFor(() => {
      expect(screen.queryByTestId("login-screen")).toBeTruthy();
    });
  });
});
