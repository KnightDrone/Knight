import React from "react";
import {
  screen,
  render,
  waitFor,
  fireEvent,
} from "@testing-library/react-native";
import * as Google from "expo-auth-session/providers/google";

import App from "../src/app/App";
import { onAuthStateChanged } from "../src/services/Firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text } from "react-native";
import { initI18n } from "../src/lang/i18n";

import * as Location from "expo-location";

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

jest.mock("expo-location", () => {
  const originalModule = jest.requireActual("expo-location");
  return {
    __esModule: true,
    ...originalModule,
    requestForegroundPermissionsAsync: jest.fn(),
    watchPositionAsync: jest.fn(),
  };
});

jest.mock("react-native-vector-icons/MaterialIcons", () => "Icon");
jest.mock("../src/components/LocationMarker", () => "LocationMarker");

jest.mock("../src/components/buttons/PayButton", () => ({
  __esModule: true,
  PayButton: () => {
    return (
      <View testID="mocked-pay-button">
        <Text>MockedPayButton</Text>
      </View>
    );
  },
}));

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
    screen.debug();
    expect(queryByTestId("map-view")).toBeTruthy();
  });
}

beforeAll(() => {
  global.alert = jest.fn();

  // Avoid useless error messages
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("App Navigation", () => {
  beforeEach(() => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      { status: "granted" }
    );
    (Location.watchPositionAsync as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        remove: jest.fn(),
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the login screen as the initial route", () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId("login-screen")).toBeTruthy();
  });

  it("directly logs in with Google due to the mock implementation", async () => {
    const { queryByTestId } = render(<App />);
    await waitFor(() => {
      expect(queryByTestId("map-view")).toBeTruthy();
    });
  });

  it.only("logs in when the login button is pressed", async () => {
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
      expect(queryByTestId("map-view")).toBeTruthy();
    });

    const orderMenuButton = getByTestId("order-button");
    fireEvent.press(orderMenuButton);

    await waitFor(() => {
      expect(queryByTestId("order-menu-screen")).toBeTruthy();
    });

    const backButton = getByTestId("order-menu-back-button");
    fireEvent.press(backButton);

    await waitFor(() => {
      expect(queryByTestId("map-view")).toBeTruthy();
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

    fireEvent.press(getByTestId("order-menu-back-button"));
    await waitFor(() => {
      expect(queryByTestId("map-view")).toBeTruthy();
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
      expect(queryByTestId("map-view")).toBeTruthy();
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
      expect(queryByTestId("map-view")).toBeTruthy();
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
      expect(queryByTestId("map-view")).toBeTruthy();
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
      expect(queryByTestId("map-view")).toBeTruthy();
      expect(onAuthStateChanged).toHaveBeenCalled();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("@user");
      expect(alert).toHaveBeenCalledWith(new Error("AsyncStorage error"));
    });
  });
});
