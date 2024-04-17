import React from "react";
import {
  screen,
  render,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import Login from "../src/app/Login";
import { GoogleAuthProvider } from "../src/services/Firebase";
import * as Google from "expo-auth-session/providers/google";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  signInWithEmailAndPassword,
  signInWithCredential,
} from "firebase/auth";
import { Text } from "react-native";

const Stack = createStackNavigator();

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

const LoginTest = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"Login"}>
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
        <Stack.Screen name="ForgotPassword">
          {() => (
            <>
              <Text testID="forgot-password-screen">
                Forgot Password Screen
              </Text>
            </>
          )}
        </Stack.Screen>
        <Stack.Screen name="SignUp">
          {() => (
            <>
              <Text testID="sign-up-screen">Sign Up Screen</Text>
            </>
          )}
        </Stack.Screen>
        <Stack.Screen name="OrderMenu">
          {() => (
            <>
              <Text testID="order-menu">Order Menu</Text>
            </>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe("Login Component", () => {
  it("allows email login", async () => {
    const rendered = render(
      <LoginTest />
    );

    getByPlaceholderText = rendered.getByPlaceholderText;
    getByText = rendered.getByText;
    queryByTestId = rendered.queryByTestId;

    fireEvent.changeText(
      getByPlaceholderText("Enter your username or email"),
      "test@example.com"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter your password"),
      "password123"
    );

    fireEvent.press(getByText("Log in"));

    expect(signInWithEmailAndPassword).toHaveBeenCalled();
    await waitFor(() => expect(queryByTestId("map-screen")).toBeTruthy());
  });

  it("sets showPassword to true when the eye icon is pressed", async () => {
    const rendered = render(
      <LoginTest />
    );

    fireEvent.press(rendered.getByTestId("password-toggle"));
    expect(
      rendered.getByPlaceholderText("Enter your password").props.secureTextEntry
    ).toBe(false);
  });

  // it("calls login when login button is pressed", async () => {
  //   const rendered = render(
  //    <LoginTest />
  //   );

  //   fireEvent.press(rendered.getByText("Log in"));
  //   expect(signInWithEmailAndPassword).toHaveBeenCalled();
  //  });

  it("navigates to the forgot password screen when the link is pressed", async () => {
    const { getByTestId } = render(
      <LoginTest />
    );

    fireEvent.press(getByTestId("forgot-password-link"));
    await waitFor(() =>
      expect(screen.queryByTestId("forgot-password-screen")).toBeTruthy()
    );
  });

  it("navigates to the sign up screen when the link is pressed", async () => {
    const { getByTestId } = render(
      <LoginTest />
    );

    fireEvent.press(getByTestId("sign-up-link"));
    await waitFor(() =>
      expect(screen.queryByTestId("sign-up-screen")).toBeTruthy()
    );
  });

  // it("catches signInWithEmailAndPassword error", async () => { });

  // it("sets error for invalid credentials (signInWithEmailAndPassword has no user object)", async () => { });

  it("handles Google login correctly", async () => {
    const mockNavigate = jest.fn();
    const { getByText } = render(
      <LoginTest />
    );

    fireEvent.press(getByText("Continue with Google"));

    expect(Google.useAuthRequest()[2]).toHaveBeenCalled();
    expect(GoogleAuthProvider.credential).toHaveBeenCalled();
    expect(signInWithCredential).toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.queryByTestId("map-screen")).toBeTruthy()
    );
  });
});
