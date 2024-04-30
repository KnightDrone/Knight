import * as React from "react";
import {
  screen,
  render,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import { useFonts } from "../__mocks__/expo-font";
import AppStack from "../src/navigation/StackNavigation";
import { describe } from "node:test";

useFonts.mockReturnValue([true]);

// Avoid useless error messages
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

jest.mock("../src/services/Firebase", () => ({
  auth: jest.fn(),
  GoogleAuthProvider: {
    credential: jest.fn(),
  },
  signInWithCredential: jest.fn(() =>
    Promise.resolve({ user: { uid: "12345" } })
  ),
  signInWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({ user: { uid: "12345" } })
  ),
}));

jest.mock("expo-auth-session/providers/google", () => ({
  useAuthRequest: jest.fn(() => [
    {}, // request
    { type: "success", params: { id_token: "fake_token" } }, // response
    jest.fn(), // promptAsync, simulating successful prompt
  ]),
}));

//// =*=*=*=*=*=*=*=*=*
//// Test for AppStack
//// =*=*=*=*=*=*=*=*=*

describe("AppStack Navigation Tests", () => {
  it("navigates to the Login screen when app starts", () => {
    const { getByTestId } = render(
      <AppStack isLoggedIn={"Login"} user={null} />
    );
    // Check if the Login screen is displayed by looking for a specific text
    expect(getByTestId("login-screen")).toBeTruthy();
  });

  it("navigates to the Map screen when user is logged in", async () => {
    const { queryByTestId } = render(
      <AppStack isLoggedIn={"Map"} user={null} />
    );
    await waitFor(() => {
      // Check if the Map screen is displayed by looking for a specific text
      expect(queryByTestId("map-overview-screen")).toBeTruthy();
    });
  });

  it("navigates to ForgotPassword screen when 'Reset Password' is pressed", async () => {
    const { queryByTestId } = render(
      <AppStack isLoggedIn={"Login"} user={null} />
    );
    await waitFor(() => {
      fireEvent.press(queryByTestId("forgot-password-link"));
      // Check if the ForgotPassword screen is displayed by looking for a specific text
      expect(screen.getByTestId("forgot-password-screen")).toBeTruthy();
    });
  });

  it("navigates to ForgotPassword screen when 'Reset Password' is pressed then navigates back when back-button is pressed", async () => {
    const { queryByTestId } = render(
      <AppStack isLoggedIn={"Login"} user={null} />
    );

    fireEvent.press(queryByTestId("forgot-password-link"));
    fireEvent.press(queryByTestId("forgot-password-back-button"));
    await waitFor(() => {
      // Check if the ForgotPassword screen is displayed by looking for a specific text
      expect(screen.getByTestId("login-screen")).toBeTruthy();
    });
  });

  it("navigates to SignUp screen when 'Sign Up' is pressed", async () => {
    const { queryByTestId } = render(
      <AppStack isLoggedIn={"Login"} user={null} />
    );
    await waitFor(() => {
      fireEvent.press(queryByTestId("sign-up-link"));
      // Check if the SignUp screen is displayed by looking for a specific text
      expect(screen.getByTestId("sign-up-screen")).toBeTruthy();
    });
  });

  it("navigates to SignUp screen when 'Sign Up' is pressed then navigates back when back-button is pressed", async () => {
    const { queryByTestId } = render(
      <AppStack isLoggedIn={"Login"} user={null} />
    );
    fireEvent.press(queryByTestId("sign-up-link"));
    fireEvent.press(queryByTestId("sign-up-back-button"));
    await waitFor(() => {
      // Check if the SignUp screen is displayed by looking for a specific text
      expect(screen.getByTestId("login-screen")).toBeTruthy();
    });
  });

  it("navigates to the map screen after successful sign-up", async () => {
    const { getByText, getByTestId } = render(
      <AppStack isLoggedIn={"SignUp"} user={null} />
    );

    // Mock is true (successful sign-up) by default in jestSetupFile.js
    // Simulate successful sign-up
    fireEvent.press(getByTestId("sign-up-link"));
    fireEvent.press(getByTestId("sign-up-button"));
    // Wait for any async actions to complete
    await waitFor(() => {
      expect(screen.getByTestId("map-overview-screen")).toBeTruthy();
    });
  });
  const mockUser = { uid: "123", email: "random@gmail.com" };

  it("navigates to OrderMenu screen when 'Order' is pressed", async () => {
    const { findByTestId } = render(
      <AppStack isLoggedIn={"Map"} user={mockUser} />
    );
    const orderButton = await findByTestId("order-button");
    fireEvent.press(orderButton);
    await waitFor(() => {
      expect(screen.getByTestId("order-menu-screen")).toBeTruthy();
    });
  });

  it("navigates to OrderMenu then back to Map screen", async () => {
    const { queryByTestId } = render(
      <AppStack isLoggedIn={"Map"} user={mockUser} />
    );
    fireEvent.press(queryByTestId("order-button"));
    fireEvent.press(queryByTestId("order-menu-back-button"));
    await waitFor(() => {
      // Check if the OrderMenu screen is displayed by looking for a specific text
      expect(screen.getByTestId("map-overview-screen")).toBeTruthy();
    });
  });

  test("navigates to OrderMenu when order button is pressed", () => {
    const { getByTestId } = render(<UserStackTest />);
    fireEvent.press(getByTestId("order-button"));
    // Check if the OrderMenu screen is displayed by looking for a specific text
    expect(screen.getByTestId("order-menu-screen")).toBeTruthy();
  });
});
