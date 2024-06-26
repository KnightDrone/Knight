import React from "react";
import {
  screen,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react-native";
import { Text } from "react-native";
import SignUp from "../src/app/auth/SignUp";
import * as Google from "expo-auth-session/providers/google";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();
import Login from "../src/app/auth/Login";
import passwordsForTesting from "../src/utils/passwords";
import { createUserWithEmailAndPassword } from "../src/services/Firebase";
import { initI18n } from "../src/lang/i18n";
import { t } from "i18next";

// Avoid useless error messages
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});

  initI18n();
});

const SignUpTest = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"SignUp"}>
        <Stack.Screen name="Login">
          {(props) => <Login {...props} />}
        </Stack.Screen>
        <Stack.Screen name="UserDrawer">
          {() => (
            <>
              <Text testID="map-screen">Map screen</Text>
            </>
          )}
        </Stack.Screen>
        <Stack.Screen name="SignUp">
          {(props) => <SignUp {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe("SignUp Component", () => {
  // Setup mock implementations
  beforeEach(() => {
    const mockPromptAsync = jest.fn();
    // Mock the Google authentication request setup
    (Google.useAuthRequest as jest.Mock).mockReturnValue([
      {}, // Mocked request
      { type: "success", params: { id_token: "mock-id-token" } }, // Mocked response
      mockPromptAsync, // Mocked promptAsync function
    ]);
  });

  it("renders correctly", () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <SignUpTest />
    );
    expect(getByTestId("signup-title")).toBeTruthy();
    expect(getByTestId("username-input")).toBeTruthy();
    expect(getByTestId("email-input")).toBeTruthy();
    expect(getByTestId("password-input")).toBeTruthy();
  });

  it("updates email and password fields correctly", () => {
    const { getByPlaceholderText } = render(<SignUpTest />);

    const emailInput = getByPlaceholderText("Enter your email");
    const passwordInput = getByPlaceholderText("Enter your password");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");
    expect(emailInput.props.value).toBe("test@example.com");
    expect(passwordInput.props.value).toBe("password123");
  });

  it("displays password strength and suggestions correctly", () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <SignUpTest />
    );

    const passwordInput = getByPlaceholderText("Enter your password");

    const passwordMap = [
      {
        password: passwordsForTesting[0],
        strength: t("password-suggestions.too-weak"),
        suggestions: [
          t("password-suggestions.length"),
          t("password-suggestions.number"),
          t("password-suggestions.upper-lower"),
          t("password-suggestions.special"),
        ],
      },
      {
        password: passwordsForTesting[1],
        strength: t("password-suggestions.weak"),
        suggestions: [
          t("password-suggestions.number"),
          t("password-suggestions.special"),
          t("password-suggestions.upper-lower"),
        ],
      },
      {
        password: passwordsForTesting[2],
        strength: t("password-suggestions.moderate"),
        suggestions: [
          t("password-suggestions.special"),
          t("password-suggestions.upper-lower"),
        ],
      },
      {
        password: passwordsForTesting[3],
        strength: t("password-suggestions.moderate"),
        suggestions: [t("password-suggestions.special")],
      },
      {
        password: passwordsForTesting[4],
        strength: t("password-suggestions.very-strong"),
        suggestions: [],
      },
      {
        password: passwordsForTesting[5],
        strength: t("password-suggestions.very-strong"),
        suggestions: [],
      },
      {
        password: passwordsForTesting[6],
        strength: t("password-suggestions.strong"),
        suggestions: [t("password-suggestions.length")],
      },
    ];

    passwordMap.forEach((entry) => {
      fireEvent.changeText(passwordInput, entry.password);
      const passwordStrength = getByTestId("pw-strength");
      expect(passwordStrength).toBeTruthy();
      expect(getByText(entry.strength)).toBeTruthy();
      entry.suggestions.forEach((suggestion) => {
        expect(getByText(suggestion)).toBeTruthy();
      });
    });
  });

  it('initiates Google sign-in process on "Continue with Google" button press', async () => {
    const { getByText } = render(<SignUpTest />);
    fireEvent.press(getByText("Continue with Google"));
    // Wait for any async actions to complete
  });

  it("toggles password visibility when the eye icon is pressed", () => {
    const { getByTestId, getByPlaceholderText, getAllByTestId } = render(
      <SignUpTest />
    );
    const passwordInput = getByPlaceholderText("Enter your password");
    const passwordToggles = getAllByTestId("password-toggle");
    const passwordToggle = passwordToggles[2]; // Select the third password-toggle

    // first showPassword = false, secureTextEntry = !showPassword
    expect(passwordInput.props.secureTextEntry).toBe(true);

    fireEvent.press(passwordToggle); // second showPassword = true
    expect(passwordInput.props.secureTextEntry).toBe(false);

    fireEvent.press(passwordToggle); // third showPassword = false
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it("navigates to the map screen after successful sign-up", async () => {
    const { getByText, getByTestId } = render(<SignUpTest />);

    // Mock is true (successful sign-up) by default in jestSetupFile.js

    // Simulate successful sign-up
    fireEvent.press(getByTestId("sign-up-button"));
    // Wait for any async actions to complete
    await waitFor(() => {
      expect(screen.getByTestId("map-screen")).toBeTruthy();
    });
  });

  it("can handle failed responses from the sign-up API", async () => {
    // Mock the API call within handleSignUp to reject
    (
      createUserWithEmailAndPassword as jest.MockedFunction<
        typeof createUserWithEmailAndPassword
      >
    ).mockImplementationOnce(() =>
      Promise.reject(new Error("User already exists"))
    );

    (Google.useAuthRequest as jest.Mock).mockReturnValue([
      {}, // Mocked request
      { type: "fail", params: {} }, // Mocked response
      jest.fn(), // Mocked promptAsync function
    ]);

    const { getByText, getByTestId, findByTestId } = render(<SignUpTest />);

    const userNameInput = getByTestId("username-input");
    const emailInput = getByTestId("email-input");
    const passwordInput = getByTestId("password-input");

    fireEvent.changeText(userNameInput, "Test User");
    fireEvent.changeText(emailInput, "test@gmail.com");
    fireEvent.changeText(passwordInput, "password123");

    fireEvent.press(getByTestId("sign-up-button"));

    const errorMessage = await findByTestId("signup-error-message");
    expect(errorMessage).toBeTruthy();

    await waitFor(() =>
      expect(getByTestId("signup-error-message").props.children).toBe(
        "An unknown error occurred."
      )
    );
  });
});
