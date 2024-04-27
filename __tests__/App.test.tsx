import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import * as Google from "expo-auth-session/providers/google";

import App from "../src/app/App";
import { onAuthStateChanged } from "../src/services/Firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text } from "react-native";

beforeEach(() => {
  const mockPromptAsync = jest.fn();

  // Mock the Google authentication request setup, makes the user sign in automatically with google
  (Google.useAuthRequest as jest.Mock).mockReturnValue([
    {}, // Mocked request
    { type: "success", params: { id_token: "mock-id-token" } }, // Mocked response
    mockPromptAsync, // Mocked promptAsync function
  ]);
});

jest.mock("../src/components/PayButton", () => ({
  __esModule: true,
  PayButton: () => {
    return (
      <View testID="mocked-pay-button">
        <Text>MockedPayButton</Text>
      </View>
    );
  },
}));

beforeAll(() => {
  global.alert = jest.fn();

  // Avoid useless error messages
  jest.spyOn(console, "error").mockImplementation(() => {});
});

// Helper function to simulate login actions
async function simulateLogin(
  getByPlaceholderText: any,
  getByTestId: any,
  queryByTestId: any
) {
  const emailInput = getByPlaceholderText("Enter your username or email");
  const passwordInput = getByPlaceholderText("Enter your password");
  fireEvent.changeText(emailInput, "random@gmail.com");
  fireEvent.changeText(passwordInput, "password");
  fireEvent.press(getByTestId("login-button"));

  await waitFor(() => {
    expect(queryByTestId("map-overview-screen")).toBeTruthy();
  });
}

describe("App.tsx Navigation", () => {
  it("renders the login screen as the initial route", () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId("login-screen")).toBeTruthy();
  });

  it("directly logs in with Google due to the mock implementation", async () => {
    const { queryByTestId } = render(<App />);
    await waitFor(() => {
      expect(queryByTestId("map-overview-screen")).toBeTruthy();
    });
  });

  it("navigates to sign up screen when the sign up button is pressed", async () => {
    const { getByText, queryByTestId, getByTestId } = render(<App />);
    fireEvent.press(getByTestId("sign-up-link"));
    await waitFor(() => {
      expect(queryByTestId("sign-up-screen")).toBeTruthy();
    });
  });

  it("navigates to forgot password screen when the forgot password button is pressed", async () => {
    const { getByText, queryByTestId, getByTestId } = render(<App />);
    const forgotPasswordButton = getByTestId("forgot-password-link");
    fireEvent.press(forgotPasswordButton);

    await waitFor(() => {
      expect(queryByTestId("forgot-password-screen")).toBeTruthy();
    });
  });

  it("logs in when the login button is pressed", async () => {
    (Google.useAuthRequest as jest.Mock).mockReturnValue([
      {},
      { type: "fail", params: { id_token: "" } },
      jest.fn(),
    ]);

    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <App />
    );

    await simulateLogin(getByPlaceholderText, getByTestId, queryByTestId);
  });

  it("logs in, go to map overview, and then go to order menu", async () => {
    (Google.useAuthRequest as jest.Mock).mockReturnValue([
      {},
      { type: "fail", params: { id_token: "" } },
      jest.fn(),
    ]);

    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <App />
    );

    await simulateLogin(getByPlaceholderText, getByTestId, queryByTestId);

    const orderMenuButton = getByTestId("order-button");
    fireEvent.press(orderMenuButton);

    await waitFor(() => {
      expect(queryByTestId("order-menu-screen")).toBeTruthy();
    });
  });

  it("goes to order menu, then goes back", async () => {
    const { getByTestId, queryByTestId } = render(<App />);

    await waitFor(() => {
      expect(queryByTestId("map-overview-screen")).toBeTruthy();
    });

    const orderMenuButton = getByTestId("order-button");
    fireEvent.press(orderMenuButton);

    await waitFor(() => {
      expect(queryByTestId("order-menu-screen")).toBeTruthy();
    });

    const backButton = getByTestId("back-button");
    fireEvent.press(backButton);

    await waitFor(() => {
      expect(queryByTestId("map-overview-screen")).toBeTruthy();
    });
  });

  it("logs in and navigates through the app", async () => {
    const { getByPlaceholderText, getByTestId, queryByTestId } = render(
      <App />
    );
    await simulateLogin(getByPlaceholderText, getByTestId, queryByTestId);

    const orderMenuButton = getByTestId("order-button");
    fireEvent.press(orderMenuButton);

    await waitFor(() => {
      expect(queryByTestId("order-menu-screen")).toBeTruthy();
    });

    fireEvent.press(getByTestId("back-button"));
    await waitFor(() => {
      expect(queryByTestId("map-overview-screen")).toBeTruthy();
    });
  });

  it("onAuthStateChanged is called when the user logs in", async () => {
    const mockUser = { uid: "123", email: "random@gmail.com" };
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    const { queryByTestId } = render(<App />);

    await waitFor(() => {
      expect(queryByTestId("map-overview-screen")).toBeTruthy();
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

    const { queryByTestId } = render(<App />);
    await waitFor(() => {
      expect(queryByTestId("map-overview-screen")).toBeTruthy();
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

    const { queryByTestId } = render(<App />);
    await waitFor(() => {
      expect(queryByTestId("map-overview-screen")).toBeTruthy();
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

    const { queryByTestId } = render(<App />);
    await waitFor(() => {
      expect(queryByTestId("map-overview-screen")).toBeTruthy();
      expect(onAuthStateChanged).toHaveBeenCalled();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("@user");
      expect(alert).toHaveBeenCalledWith(new Error("AsyncStorage error"));
    });
  });

  // Not sure how to do this test, as we don't explicitly have a Go Back button inside our SignUp, I believe it's in the Navigator
  /*it("navigates back to login screen when the sign up back button is pressed", async () => {
    (Google.useAuthRequest as jest.Mock).mockReturnValue([
      {},
      { type: "fail", params: { id_token: "" } },
      jest.fn(),
    ]);

    const { getByText, getByTestId, queryByTestId } = render(<App />);
    const signUpButton = getByTestId("sign-up-link");
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(queryByTestId("sign-up-screen")).toBeTruthy();
    });

    const signUpBackButton = getByTestId("sign-up-back-button");
    fireEvent.press(signUpBackButton);

    await waitFor(() => {
      expect(queryByTestId("login-screen")).toBeTruthy();
    });
  });*/
});
