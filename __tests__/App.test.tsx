import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import App from "../src/app/App";
import Login from "../src/app/Login";

// Navigation imports for testing
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 1. Navigation tests
describe("App Navigation", () => {
  it("renders the login screen as the initial route", () => {
    const component = (
      <NavigationContainer>
        <App />
      </NavigationContainer>
    );
    const { getByText } = render(component);
    expect(getByText("Login to Wild Knight")).toBeTruthy();
  });
});

const createTestProps = (props: any) => ({
  navigation: {
    navigate: jest.fn(),
    goBack: jest.fn(),
    // Add other navigation functions that you use in your app
  },
  ...props,
});

describe("Login Navigation", () => {
  const props = createTestProps({});
  const { getByText } = render(<Login {...props} />);

  it("navigates to the SignUp screen when the Sign Up button is pressed", () => {
    const signUpButton = getByText("Sign Up!"); // Adjust based on the text in your button
    fireEvent.press(signUpButton);
    expect(props.navigation.navigate).toHaveBeenCalledWith("SignUp");
  });

  it("navigates back when the back button is pressed", () => {
    const backButton = getByText("Back"); // Adjust based on your back button
    fireEvent.press(backButton);
    expect(props.navigation.goBack).toHaveBeenCalled();
  });
});

// 2. Async Storage testing
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
describe("AsyncStorage Operations", () => {
  it("checks local user on app start", async () => {
    require("./App"); // This line requires your App component
    expect(AsyncStorage.getItem).toHaveBeenCalledWith("@user");
  });
});

// 3. Storage and Authentication
jest.mock("firebase/auth", () => ({
  GoogleAuthProvider: jest.fn(),
  onAuthStateChanged: jest.fn(() => jest.fn()), // Returns an unsubscribe function
  signInWithCredential: jest.fn(),
}));
describe("Firebase Authentication", () => {
  it("attempts to sign in with credential on successful Google auth", () => {
    // Mock successful Google auth response
    const { response } = require("./App"); // Adjust this line to correctly import or simulate the response
    // Simulate a successful Google auth response
    response.type = "success";
    response.params = { id_token: "some-token" };
    // Your test logic here
    // For example, check if signInWithCredential was called
  });
});

describe("Conditional Rendering", () => {
  it("displays loading text when loading", () => {
    // Mock the state to simulate loading
    jest.spyOn(React, "useState").mockReturnValueOnce([true, jest.fn()]);
    const { getByText } = render(<App />);
    expect(getByText("Loading...")).toBeTruthy();
  });
});
