// Settings.test.tsx
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Settings from "../src/app/settings/Setting";
import { Alert } from "react-native";
import { initI18n } from "../src/lang/i18n";

jest.spyOn(Alert, "alert");

beforeAll(() => {
  initI18n();
});

describe("Settings Component", () => {
  it("renders correctly", () => {
    const { getByText } = render(<Settings />);
    expect(getByText("Account")).toBeTruthy();
  });

  it("simulates pressing the log out button", async () => {
    const { getByTestId } = render(<Settings />);
    const signOutButton = getByTestId("Log out-button");
    fireEvent.press(signOutButton);
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  it("simulates pressing the role button", async () => {
    const { getByTestId } = render(<Settings />);
    const roleButton = getByTestId("role-button");
    fireEvent.press(roleButton);
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
      const lastAlertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = lastAlertCall[2];
      const confirm = buttons.find((button: any) => button.text === "Ok");
      confirm.onPress();
    });
  });

  it("cancels the log out action", async () => {
    const { getByTestId } = render(<Settings />);
    const signOutButton = getByTestId("Log out-button");
    fireEvent.press(signOutButton);
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
      const lastAlertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = lastAlertCall[2];
      const cancel = buttons.find((button: any) => button.text === "Cancel");
      cancel.onPress();
    });
  });

  it("cancels the role action", async () => {
    const { getByTestId } = render(<Settings />);
    const roleButton = getByTestId("role-button");
    fireEvent.press(roleButton);
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
      const lastAlertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = lastAlertCall[2];
      const cancel = buttons.find((button: any) => button.text === "Cancel");
      cancel.onPress();
    });
  });

  it("checks icons and text for each item", () => {
    const { getByTestId, getByText } = render(<Settings />);
    expect(getByTestId("edit-icon")).toBeTruthy();
    expect(getByText("Edit profile")).toBeTruthy();
  });
});
// Mock Navigation and Firebase as necessary
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    replace: jest.fn(),
    navigate: jest.fn(),
  }),
}));

// Mock the Alert module directly
jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
}));

jest.mock("../src/services/Firebase", () => ({
  // Ensure this path is correct
  auth: {
    signOut: jest.fn(() => Promise.resolve()),
  },
}));
