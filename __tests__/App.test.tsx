import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import * as Google from "expo-auth-session/providers/google";

import App from "../src/app/App";
import { onAuthStateChanged } from "../src/services/Firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text } from "react-native";
import { initI18n } from "../src/lang/i18n";

beforeEach(() => {
  const mockPromptAsync = jest.fn();

  // Mock the Google authentication request setup, makes the user sign in automatically with google
  (Google.useAuthRequest as jest.Mock).mockReturnValue([
    {}, // Mocked request
    { type: "success", params: { id_token: "mock-id-token" } }, // Mocked response
    mockPromptAsync, // Mocked promptAsync function
  ]);

  initI18n();
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

describe("App Navigation", () => {
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
});
