import React from "react";
import {
  screen,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react-native";
import { Text } from "react-native";
import SignUp from "../src/app/SignUp";
import * as Google from "expo-auth-session/providers/google";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();
import { useFonts } from "../__mocks__/expo-font";
import Login from "../src/app/Login";
import { createUserWithEmailAndPassword } from "firebase/auth";
import passwordsForTesting from "../src/types/Passwords";

useFonts.mockReturnValue([true]);

// Avoid useless error messages
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const SignUpTest = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"SignUp"}>
        <Stack.Screen name="Login">
          {(props) => <Login {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Map">
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
    Google.useAuthRequest.mockReturnValue([
      {}, // Mocked request
      { type: "success", params: { id_token: "mock-id-token" } }, // Mocked response
      mockPromptAsync, // Mocked promptAsync function
    ]);
  });

  it("renders correctly", () => {
    const { getByText, getByPlaceholderText } = render(<SignUpTest />);
    expect(getByText("Sign Up")).toBeTruthy();
    expect(getByPlaceholderText("Enter your email")).toBeTruthy();
    expect(getByPlaceholderText("Enter your password")).toBeTruthy();
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
        strength: "Too Weak",
        suggestions: [
          "Password should be at least 8 characters long",
          "Add at least one number",
          "Include both upper and lower case letters",
          "Include at least one special character",
        ],
      },
      {
        password: passwordsForTesting[1],
        strength: "Weak",
        suggestions: [
          "Add at least one number",
          "Include both upper and lower case letters",
          "Include at least one special character",
        ],
      },
      {
        password: passwordsForTesting[2],
        strength: "Moderate",
        suggestions: [
          "Include both upper and lower case letters",
          "Include at least one special character",
        ],
      },
      {
        password: passwordsForTesting[3],
        strength: "Moderate",
        suggestions: ["Include at least one special character"],
      },
      {
        password: passwordsForTesting[4],
        strength: "Very Strong",
        suggestions: [],
      },
      {
        password: passwordsForTesting[5],
        strength: "Very Strong",
        suggestions: [],
      },
      {
        password: passwordsForTesting[6],
        strength: "Strong",
        suggestions: ["Password should be at least 8 characters long"],
      },
    ];

    passwordMap.forEach((entry) => {
      fireEvent.changeText(passwordInput, entry.password);
      const passwordStrength = getByTestId("pw-strength");
      expect(
        passwordStrength.props.children[
          passwordStrength.props.children.length - 1
        ]
      ).toBe(entry.strength);
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
    const { getByTestId, getByPlaceholderText } = render(<SignUpTest />);
    const passwordInput = getByPlaceholderText("Enter your password");
    const eyeIcon = getByTestId("password-toggle");

    // first showPassword = false, secureTextEntry = !showPassword
    expect(passwordInput.props.secureTextEntry).toBe(true);

    fireEvent.press(eyeIcon); // second showPassword = true
    expect(passwordInput.props.secureTextEntry).toBe(false);

    fireEvent.press(eyeIcon); // third showPassword = false
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it("navigates to the map screen after successful sign-up", async () => {
    const { getByText } = render(<SignUpTest />);

    // Mock is true (successful sign-up) by default in jestSetupFile.js

    // Simulate successful sign-up
    fireEvent.press(getByText("Sign Up"));
    // Wait for any async actions to complete
    await waitFor(() => {
      expect(screen.getByTestId("map-screen")).toBeTruthy();
    });
  });

  it("can handle failed responses from the sign-up API", async () => {
    // Mock the API call within handleSignUp to reject
    createUserWithEmailAndPassword.mockImplementationOnce(() =>
      Promise.reject(new Error("User already exists"))
    );

    Google.useAuthRequest.mockReturnValue([
      {}, // Mocked request
      { type: "fail", params: {} }, // Mocked response
      jest.fn(), // Mocked promptAsync function
    ]);

    const { getByText, getByTestId } = render(<SignUpTest />);

    const emailInput = getByTestId("email-input");
    const passwordInput = getByTestId("password-input");

    fireEvent.changeText(emailInput, "test@gmail.com");
    fireEvent.changeText(passwordInput, "password123");

    fireEvent.press(getByText("Sign Up"));

    const errorMessage = getByTestId("signup-error-message");
    expect(errorMessage).toBeTruthy();

    await waitFor(() =>
      expect(getByTestId("signup-error-message").props.children).toBe(
        "Sign Up failed. Please check your credentials."
      )
    );
  });
});
