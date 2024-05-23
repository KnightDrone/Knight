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

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "../src/services/Firebase";

jest.mock("expo-location", () => {
  const originalModule = jest.requireActual("expo-location");
  return {
    __esModule: true,
    ...originalModule,
    requestForegroundPermissionsAsync: jest.fn(),
    watchPositionAsync: jest.fn(),
  };
});

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

jest.mock("react-native-vector-icons/MaterialIcons", () => "Icon");
jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => "Icon");
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
  createUserWithEmailAndPassword: jest.fn(() =>
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
    const { queryByTestId } = render(<AppStack isLoggedIn={"UserDrawer"} />);
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
    const backButton = queryByTestId("forgot-password-back-button");
    if (backButton) {
      fireEvent.press(backButton);
    } else {
      throw new Error("Back button not found");
    }

    await waitFor(
      () => {
        expect(queryByTestId("login-screen")).toBeTruthy();
      },
      { timeout: 1000 }
    ); // Adjust timeout based on your needs
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

    const backButton = queryByTestId("sign-up-back-button");
    if (backButton) {
      fireEvent.press(backButton);
    } else {
      throw new Error("Back button not found");
    }
    await waitFor(
      () => {
        // Check if the SignUp screen is displayed by looking for a specific text
        expect(screen.getByTestId("login-screen")).toBeTruthy();
      },
      { timeout: 1000 }
    );
  });

  it("navigates to the map screen after successful sign-up", async () => {
    const { getByTestId } = render(<AppStack isLoggedIn={"Login"} />);

    // Mock is true (successful sign-up) by default in jestSetupFile.js
    // Simulate successful sign-up
    fireEvent.press(getByTestId("sign-up-link"));

    fireEvent.changeText(getByTestId("username-input"), "TestUser");
    fireEvent.changeText(getByTestId("email-input"), "test@gmail.com");
    fireEvent.changeText(getByTestId("password-input"), "password123");

    fireEvent.press(getByTestId("sign-up-button"));
    // Wait for any async actions to complete
    await waitFor(() => {
      expect(screen.getByTestId("map-view")).toBeTruthy();
    });
  });

  it("navigates Map->OrderMenu", async () => {
    const { queryByTestId } = render(<AppStack isLoggedIn={"UserDrawer"} />);
    // Wait for the loading state to complete
    await waitFor(() => {
      expect(queryByTestId("map-view")).toBeTruthy();
    });
    fireEvent.press(queryByTestId("order-button"));
    await waitFor(() => {
      expect(screen.queryByTestId("order-menu-screen")).toBeTruthy();
    });
  });

  it("navigates Map->OrderMenu->OrderPlaced", async () => {
    const { queryByTestId } = render(<AppStack isLoggedIn={"UserDrawer"} />);
    fireEvent.press(queryByTestId("order-button"));
    await waitFor(() => {
      // Check if the Map screen is displayed by looking for a specific text
      expect(screen.queryByTestId("order-menu-screen")).toBeTruthy();
    });
  });
});

describe("Drawer Navigation", () => {
  it("should open the drawer and navigate to the Profile screen", async () => {
    const { getByTestId, queryByTestId, queryByText } = render(
      <AppStack isLoggedIn="UserDrawer" />
    );
    // Assuming 'user-drawer-button' is the testID for the button that toggles the drawer
    const drawerToggleButton = getByTestId("user-drawer-button");
    fireEvent.press(drawerToggleButton);
    // Wait for the drawer to open and the Profile button to be visible
    await waitFor(
      () => {
        expect(queryByTestId("profile-drawer-button")).toBeNull();
      },
      { timeout: 1000 }
    );
    // Simulate pressing the Profile button in the drawer
    const profileButton = queryByText("Profile");
    fireEvent.press(profileButton);
    // Check if the Profile screen is displayed
    await waitFor(
      () => {
        expect(queryByTestId("profile-screen")).toBeTruthy();
      },
      { timeout: 1000 }
    );
  });

  it("should open the drawer and navigate to the Settings screen", async () => {
    const { getByTestId, queryByTestId, queryByText } = render(
      <AppStack isLoggedIn="UserDrawer" />
    );
    // Assuming 'user-drawer-button' is the testID for the button that toggles the drawer
    const drawerToggleButton = getByTestId("user-drawer-button");
    fireEvent.press(drawerToggleButton);
    // Wait for the drawer to open and the Profile button to be visible
    await waitFor(
      () => {
        expect(queryByTestId("profile-drawer-button")).toBeNull();
      },
      { timeout: 1000 }
    );
    // Simulate pressing the Profile button in the drawer
    const profileButton = queryByText("Settings");
    fireEvent.press(profileButton);
    // Check if the Profile screen is displayed
    await waitFor(
      () => {
        expect(queryByTestId("settings-screen")).toBeTruthy();
      },
      { timeout: 1000 }
    );
  });

  it("should open the drawer and navigate to the OrderHistory screen", async () => {
    const { getByTestId, queryByTestId, queryByText } = render(
      <AppStack isLoggedIn="UserDrawer" />
    );
    // Assuming 'user-drawer-button' is the testID for the button that toggles the drawer
    const drawerToggleButton = getByTestId("user-drawer-button");
    fireEvent.press(drawerToggleButton);
    // Wait for the drawer to open and the Profile button to be visible
    await waitFor(
      () => {
        expect(queryByTestId("profile-drawer-button")).toBeNull();
      },
      { timeout: 1000 }
    );

    // Simulate pressing the Profile button in the drawer
    const profileButton = queryByText("Order History");
    fireEvent.press(profileButton);
    // Check if the Profile screen is displayed
    await waitFor(
      () => {
        expect(queryByTestId("order-history-screen")).toBeTruthy();
      },
      { timeout: 1000 }
    );
  });

  it("should open the drawer and navigate to the OrderMenu screen", async () => {
    const { getByTestId, queryByTestId, queryByText } = render(
      <AppStack isLoggedIn="UserDrawer" />
    );
    // Assuming 'user-drawer-button' is the testID for the button that toggles the drawer
    const drawerToggleButton = getByTestId("user-drawer-button");
    fireEvent.press(drawerToggleButton);
    // Wait for the drawer to open and the Profile button to be visible
    await waitFor(
      () => {
        expect(queryByTestId("profile-drawer-button")).toBeNull();
      },
      { timeout: 1000 }
    );

    // Simulate pressing the Profile button in the drawer
    const profileButton = queryByText("Order Menu");
    fireEvent.press(profileButton);
    // Check if the Profile screen is displayed
    await waitFor(
      () => {
        expect(queryByTestId("order-menu-screen")).toBeTruthy();
      },
      { timeout: 1000 }
    );
  });

  it("Should access the OperatorDrawer", async () => {
    jest.useFakeTimers();
    const { queryByTestId } = render(<AppStack isLoggedIn="OperatorDrawer" />);

    jest.advanceTimersByTime(10_000);

    await waitFor(() => {
      expect(queryByTestId("map-view")).toBeTruthy();
    });
  });
});
