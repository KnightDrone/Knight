import * as React from "react";
import {
  screen,
  render,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import { AppStack } from "../src/app/AppStack";
import { describe } from "node:test";
import * as Google from "expo-auth-session/providers/google";
import * as Location from "expo-location";

import { signInWithEmailAndPassword } from "../src/services/Firebase";

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

beforeEach(() => {
  const mockPromptAsync = jest.fn();

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

jest.mock("../src/services/Firebase", () => ({
  auth: jest.fn(),
  GoogleAuthProvider: {
    credential: jest.fn(),
  },
  signInWithCredential: jest.fn(() =>
    Promise.resolve({
      user: {
        metadata: {
          creationTime: 0,
          lastSignInTime: 0,
        },
        uid: "12345",
      },
    })
  ),
  signInWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({
      user: {
        metadata: {
          creationTime: 0,
          lastSignInTime: 0,
        },
        uid: "12345",
      },
    })
  ),
}));

jest.mock("expo-auth-session/providers/google", () => ({
  useAuthRequest: jest.fn(() => [
    {}, // request
    { type: "success", params: { id_token: "fake_token" } }, // response
    jest.fn(), // promptAsync, simulating successful prompt
  ]),
}));

jest.mock("react-native-vector-icons/MaterialIcons", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: jest.fn().mockImplementation((props) => <View {...props} />),
  };
});

//// =*=*=*=*=*=*=*=*=*
//// Test for AppStack
//// =*=*=*=*=*=*=*=*=*

describe("AppStack Navigation Tests", () => {
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

  it("navigates to the Login screen when app starts", () => {
    const { getByTestId } = render(<AppStack isLoggedIn={"Login"} />);
    // Check if the Login screen is displayed by looking for a specific text
    expect(getByTestId("login-screen")).toBeTruthy();
  });

  it("navigates to the Map screen when user is logged in", async () => {
    const { queryByTestId } = render(<AppStack isLoggedIn={"Map"} />);
    await waitFor(() => {
      // Check if the Map screen is displayed by looking for a specific text
      expect(queryByTestId("map-view")).toBeTruthy();
    });
  });

  it("navigates to ForgotPassword screen when 'Reset Password' is pressed", async () => {
    const { queryByTestId } = render(<AppStack isLoggedIn={"Login"} />);
    await waitFor(() => {
      fireEvent.press(queryByTestId("forgot-password-link"));
      // Check if the ForgotPassword screen is displayed by looking for a specific text
      expect(screen.getByTestId("forgot-password-screen")).toBeTruthy();
    });
  });

  it("navigates to ForgotPassword screen when 'Reset Password' is pressed then navigates back when back-button is pressed", async () => {
    const { queryByTestId } = render(<AppStack isLoggedIn={"Login"} />);

    fireEvent.press(queryByTestId("forgot-password-link"));
    fireEvent.press(queryByTestId("forgot-password-back-button"));
    await waitFor(() => {
      // Check if the ForgotPassword screen is displayed by looking for a specific text
      expect(screen.getByTestId("login-screen")).toBeTruthy();
    });
  });

  it("navigates to SignUp screen when 'Sign Up' is pressed", async () => {
    const { queryByTestId } = render(<AppStack isLoggedIn={"Login"} />);
    await waitFor(() => {
      fireEvent.press(queryByTestId("sign-up-link"));
      // Check if the SignUp screen is displayed by looking for a specific text
      expect(screen.getByTestId("sign-up-screen")).toBeTruthy();
    });
  });

  it("navigates to SignUp screen when 'Sign Up' is pressed then navigates back when back-button is pressed", async () => {
    const { queryByTestId } = render(<AppStack isLoggedIn={"Login"} />);
    fireEvent.press(queryByTestId("sign-up-link"));
    fireEvent.press(queryByTestId("sign-up-back-button"));
    await waitFor(() => {
      // Check if the SignUp screen is displayed by looking for a specific text
      expect(screen.getByTestId("login-screen")).toBeTruthy();
    });
  });

  it("navigates to the map screen after successful sign-up", async () => {
    const { getByTestId } = render(<AppStack isLoggedIn={"Login"} />);

    // Mock is true (successful sign-up) by default in jestSetupFile.js
    // Simulate successful sign-up
    fireEvent.press(getByTestId("sign-up-link"));
    fireEvent.press(getByTestId("sign-up-button"));
    // Wait for any async actions to complete
    await waitFor(() => {
      expect(screen.getByTestId("map-view")).toBeTruthy();
    });
  });

  it("navigates Login -> Map -> OrderMenu", async () => {
    const { queryByTestId, getByTestId } = render(
      <AppStack isLoggedIn={"Login"} />
    );

    fireEvent.changeText(getByTestId("email-input"), "test@example.com");
    fireEvent.changeText(getByTestId("password-input"), "password123");

    fireEvent.press(getByTestId("login-button"));

    await waitFor(() => expect(signInWithEmailAndPassword).toHaveBeenCalled());
    fireEvent.press(getByTestId("order-button"));

    await waitFor(() =>
      expect(queryByTestId("order-menu-screen")).toBeTruthy()
    );
  });

  it("navigates Map->OrderMenu", async () => {
    const { queryByTestId } = render(<AppStack isLoggedIn={"Map"} />);
    // Wait for the loading state to complete
    await waitFor(() => {
      expect(queryByTestId("map-view")).toBeTruthy();
    });
    fireEvent.press(queryByTestId("order-button"));
    await waitFor(() => {
      expect(screen.queryByTestId("order-menu-screen")).toBeTruthy();
    });
  });

  it("navigates to OrderMenu then back to Map screen", async () => {
    const { queryByTestId } = render(<AppStack isLoggedIn={"Map"} />);
    fireEvent.press(queryByTestId("order-button"));
    fireEvent.press(queryByTestId("order-menu-back-button"));
    await waitFor(() => {
      // Check if the OrderMenu screen is displayed by looking for a specific text
      expect(screen.getByTestId("map-view")).toBeTruthy();
    });
  });

  it("navigates Map->OrderMenu->OrderPlaced", async () => {
    const { queryByTestId } = render(<AppStack isLoggedIn={"Map"} />);
    fireEvent.press(queryByTestId("order-button"));
    await waitFor(() => {
      // Check if the Map screen is displayed by looking for a specific text
      expect(screen.queryByTestId("order-menu-screen")).toBeTruthy();
    });
  });
});
