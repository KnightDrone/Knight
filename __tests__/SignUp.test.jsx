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

useFonts.mockReturnValue([true]);

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
    const { getByText, getByPlaceholderText } = render(
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
    expect(getByText("Sign Up")).toBeTruthy();
    expect(getByPlaceholderText("Enter your email")).toBeTruthy();
    expect(getByPlaceholderText("Enter your password")).toBeTruthy();
  });

  it("updates email and password fields correctly", () => {
    const { getByPlaceholderText } = render(
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
    const emailInput = getByPlaceholderText("Enter your email");
    const passwordInput = getByPlaceholderText("Enter your password");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");
    expect(emailInput.props.value).toBe("test@example.com");
    expect(passwordInput.props.value).toBe("password123");
  });

  it("displays password strength and suggestions correctly", () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(
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
    const passwordInput = getByPlaceholderText("Enter your password");
    fireEvent.changeText(passwordInput, "pass");
    const passwordStrength = getByTestId("pw-strength");
    expect(
      passwordStrength.props.children[
        passwordStrength.props.children.length - 1
      ]
    ).toBe("Too Weak");
    expect(
      getByText("Password should be at least 8 characters long")
    ).toBeTruthy();
  });

  it('initiates Google sign-in process on "Continue with Google" button press', async () => {
    const { getByText } = render(
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
    fireEvent.press(getByText("Continue with Google"));
    // Wait for any async actions to complete
  });
});

describe("More SignUp Component Tests", () => {
  it("toggles password visibility when the eye icon is pressed", () => {
    const { getByTestId, getByPlaceholderText } = render(
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"SignUp"}>
          <Stack.Screen name="SignUp">
            {(props) => <SignUp {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
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
    const { getByText } = render(
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
    // Simulate successful sign-up
    fireEvent.press(getByText("Sign Up"));
    // Wait for any async actions to complete
    await waitFor(() => {
      expect(screen.getByTestId("map-screen")).toBeTruthy();
    });
  });

  // Add tests for signUpWithEmail, getStrengthColor, getStrengthWidth
});
