import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import OperatorSignUp from "../src/app/auth/OperatorSignup";
import { initI18n } from "../src/lang/i18n";

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

beforeAll(() => {
  initI18n();
});

describe("OperatorSignUp", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(
      <OperatorSignUp navigation={{ navigate: jest.fn() }} />
    );
    expect(getByTestId("sign-up-screen")).toBeTruthy();
  });

  it("updates input fields correctly", async () => {
    const { getByPlaceholderText } = render(
      <OperatorSignUp navigation={{ navigate: jest.fn() }} />
    );
    const emailInput = getByPlaceholderText("Enter your email");
    const passwordInput = getByPlaceholderText("Enter your password");
    const usernameInput = getByPlaceholderText("Enter your username");
    const phoneNumberInput = getByPlaceholderText("Enter your phone number");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");

    expect(emailInput.props.value).toBe("test@example.com");
    expect(passwordInput.props.value).toBe("password123");

    fireEvent.changeText(usernameInput, "testuser");
    await waitFor(() => expect(usernameInput.props.value).toBe("testuser"));
    fireEvent.changeText(phoneNumberInput, "1234567890");
    await waitFor(() =>
      expect(phoneNumberInput.props.value).toBe("1234567890")
    );
  });

  it("validates password strength correctly", () => {
    const { getByTestId } = render(
      <OperatorSignUp navigation={{ navigate: jest.fn() }} />
    );
    const passwordInput = getByTestId("password-input");
    const passwordStrengthText = getByTestId("pw-strength");

    fireEvent.changeText(passwordInput, "weak");
    expect(passwordStrengthText.props.children).toBe("Password is too weak");

    fireEvent.changeText(passwordInput, "Weak1");
    expect(passwordStrengthText.props.children).toBe("Password is moderate");

    fireEvent.changeText(passwordInput, "password");
    expect(passwordStrengthText.props.children).toBe("Password is weak");

    fireEvent.changeText(passwordInput, "Pass123");
    expect(passwordStrengthText.props.children).toBe("Password is moderate");

    fireEvent.changeText(passwordInput, "Password@1");
    expect(passwordStrengthText.props.children).toBe("Password is very strong");
  });

  it("handles image picker correctly", async () => {
    const { getByTestId } = render(
      <OperatorSignUp navigation={{ navigate: jest.fn() }} />
    );

    const uploadPhotoButton = getByTestId("upload-photo-button");
    fireEvent.press(uploadPhotoButton);
  });
});
