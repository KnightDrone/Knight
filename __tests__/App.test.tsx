import React, { useId } from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import * as Google from "expo-auth-session/providers/google";

import App from "../src/app/App";
import { onAuthStateChanged } from "../src/services/Firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text } from "react-native";
import { initI18n } from "../src/lang/i18n";

import * as Location from "expo-location";
import { initializeAuth, reload } from "firebase/auth";

beforeEach(() => {
  const mockPromptAsync = jest.fn();

  // Mock the Google authentication request setup, makes the user sign in automatically with google
  (Google.useAuthRequest as jest.Mock).mockReturnValue([
    {}, // Mocked request
    { type: "success", params: { id_token: "mock-id-token" } }, // Mocked response
    mockPromptAsync, // Mocked promptAsync function
  ]);

  (initializeAuth as jest.Mock).mockReturnValue({
    currentUser: {
      metadata: {
        creationTime: 0,
        lastSignInTime: 0,
      },
      email: "new-email@example.com",
      uid: "new-uid",
    },
  });

  initI18n();
});

const resolvedUser = {
  user: {
    metadata: {
      creationTime: 0,
      lastSignInTime: 0,
    },
    uid: "12345",
  },
};

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  initializeAuth: jest.fn().mockReturnValue({
    currentUser: {
      metadata: {
        creationTime: 0,
        lastSignInTime: 0,
      },
      email: "test@example.com",
      uid: "12345",
    },
  }),
  getReactNativePersistence: jest.fn(),
  GoogleAuthProvider: {
    credential: jest.fn(() => "mock-credential"), // Ensure this returns a mock credential as expected
  },
  signInWithCredential: jest.fn(() => Promise.resolve(resolvedUser)), // Explicitly return a resolved promise
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve(resolvedUser)), // Explicitly return a resolved promise
  signOut: jest.fn(() => Promise.resolve()), // Explicitly return a resolved promise
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve(resolvedUser)), // Explicitly return a resolved promise
  signInWithPopup: jest.fn(() => Promise.resolve(resolvedUser)), // Explicitly return a resolved promise
  signInWithRedirect: jest.fn(() => Promise.resolve(resolvedUser)), // Explicitly return a resolved promise
  sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
  onAuthStateChanged: jest.fn(),
  updateCurrentUser: jest.fn(),
  updateEmail: jest.fn(),
  updatePassword: jest.fn(),
  updateProfile: jest.fn(),
  reload: jest.fn(() => Promise.resolve()),
}));

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
jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => "Icon");
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

jest.mock("../src/services/FirestoreManager.ts", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        writeData: jest.fn().mockResolvedValue({}),
        queryData: jest.fn().mockResolvedValue([]),
        queryOrder: jest.fn().mockResolvedValue([]),
        getUser: jest.fn().mockResolvedValue({}),
        createUser: jest.fn().mockResolvedValue({}),
      };
    }),
  };
});

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

  it("renders the login screen as the initial route", async () => {
    // Mock AsyncStorage to simulate an empty state
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(null);
      return jest.fn();
    });
    const { getByTestId } = render(<App />);
    await waitFor(() => expect(getByTestId("login-screen")).toBeTruthy()); // await because onAuthStateChanged call in App.tsx
  });

  // it.only("logs in when the login button is pressed", async () => {
  //   // Mock AsyncStorage to simulate an empty state
  //   jest.mock("@react-native-async-storage/async-storage", () => ({
  //     getItem: jest.fn().mockResolvedValue(null),
  //   }));

  //   (Google.useAuthRequest as jest.Mock).mockReturnValue([
  //     {},
  //     { type: "success", params: { id_token: "" } },
  //     jest.fn(),
  //   ]);

  //   const { getByTestId, getByPlaceholderText, queryByTestId } = render(
  //     <App />
  //   );

  //   await waitFor(() => expect(getByTestId("login-screen")).toBeTruthy());

  //   await simulateLogin(getByPlaceholderText, getByTestId, queryByTestId);
  // });

  // it("logs in, go to map overview, and then go to order menu", async () => {
  //   (Google.useAuthRequest as jest.Mock).mockReturnValue([
  //     {},
  //     { type: "fail", params: { id_token: "" } },
  //     jest.fn(),
  //   ]);

  //   const { getByTestId, getByPlaceholderText, queryByTestId } = render(
  //     <App />
  //   );

  //   await simulateLogin(getByPlaceholderText, getByTestId, queryByTestId);

  //   const orderMenuButton = getByTestId("order-button");
  //   fireEvent.press(orderMenuButton);

  //   await waitFor(() => {
  //     expect(queryByTestId("order-menu-screen")).toBeTruthy();
  //   });
  // });

  // it("goes to order menu, then goes back", async () => {
  //   const { getByTestId, queryByTestId, queryByText } = render(<App />);

  //   await waitFor(() => {
  //     expect(queryByTestId("map-view")).toBeTruthy();
  //   });

  //   const orderMenuButton = getByTestId("order-button");
  //   fireEvent.press(orderMenuButton);

  //   await waitFor(() => {
  //     expect(queryByTestId("order-menu-screen")).toBeTruthy();
  //   });

  //   const backButton = getByTestId("order-menu-drawer-back-button");
  //   fireEvent.press(backButton);

  //   await waitFor(
  //     () => {
  //       expect(queryByText("OrderMenu")).toBeTruthy();
  //     },
  //     { timeout: 1000 }
  //   );
  // });

  // it("logs in and navigates through the app", async () => {
  //   const { getByPlaceholderText, getByTestId, queryByTestId, queryByText } =
  //     render(<App />);
  //   await simulateLogin(getByPlaceholderText, getByTestId, queryByTestId);

  //   const orderMenuButton = getByTestId("order-button");
  //   fireEvent.press(orderMenuButton);

  //   await waitFor(() => {
  //     expect(queryByTestId("order-menu-screen")).toBeTruthy();
  //   });

  //   fireEvent.press(getByTestId("order-menu-drawer-back-button"));
  //   await waitFor(
  //     () => {
  //       expect(queryByText("OrderMenu")).toBeTruthy();
  //     },
  //     { timeout: 1000 }
  //   );
  // });

  // it("onAuthStateChanged is called when the user logs in", async () => {
  //   const mockUser = { uid: "123", email: "random@gmail.com" };
  //   (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
  //     callback(mockUser);
  //     return jest.fn();
  //   });

  //   const { queryByTestId } = render(<App />);
  //   await waitFor(() => {
  //     expect(queryByTestId("map-view")).toBeTruthy();
  //     expect(onAuthStateChanged).toHaveBeenCalled();
  //   });
  // });

  // it("onAuthChanged is called when the user logs out", async () => {
  //   //mock null user (logged out)
  //   const mockUser = null;
  //   (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
  //     callback(mockUser);
  //     return jest.fn();
  //   });

  //   const { queryByTestId } = render(<App />);
  //   await waitFor(() => {
  //     expect(queryByTestId("map-view")).toBeTruthy();
  //     expect(onAuthStateChanged).toHaveBeenCalled();
  //   });
  // });
});
