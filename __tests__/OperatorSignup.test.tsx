import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import OperatorSignUp from "../src/app/auth/OperatorSignup";
import { createUserWithEmailAndPassword } from "../src/services/Firebase";
import FirestoreManager from "../src/services/FirestoreManager";

jest.mock("../../services/Firebase", () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock("../../services/FirestoreManager", () => {
  return jest.fn().mockImplementation(() => {
    return { writeData: jest.fn() };
  });
});

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(() => ({
    canceled: false,
    assets: [{ uri: "image-uri" }],
  })),
}));

describe("OperatorSignUp", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(
      <OperatorSignUp navigation={{ navigate: jest.fn() }} />
    );
    expect(getByTestId("sign-up-screen")).toBeTruthy();
  });

  it("updates input fields correctly", () => {
    const { getByTestId } = render(
      <OperatorSignUp navigation={{ navigate: jest.fn() }} />
    );
    const usernameInput = getByTestId("username-input");
    const emailInput = getByTestId("email-input");
    const passwordInput = getByTestId("password-input");
    const phoneNumberInput = getByTestId("phone-number-input");

    fireEvent.changeText(usernameInput, "testuser");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "Test@1234");
    fireEvent.changeText(phoneNumberInput, "1234567890");

    expect(usernameInput.props.value).toBe("testuser");
    expect(emailInput.props.value).toBe("test@example.com");
    expect(passwordInput.props.value).toBe("Test@1234");
    expect(phoneNumberInput.props.value).toBe("1234567890");
  });

  it("validates password strength correctly", () => {
    const { getByTestId } = render(
      <OperatorSignUp navigation={{ navigate: jest.fn() }} />
    );
    const passwordInput = getByTestId("password-input");
    const passwordStrengthText = getByTestId("pw-strength");

    fireEvent.changeText(passwordInput, "weak");
    expect(passwordStrengthText.props.children).toBe("Too Weak");

    fireEvent.changeText(passwordInput, "Weak1");
    expect(passwordStrengthText.props.children).toBe("Weak");

    fireEvent.changeText(passwordInput, "Moderate1");
    expect(passwordStrengthText.props.children).toBe("Moderate");

    fireEvent.changeText(passwordInput, "Strong1!");
    expect(passwordStrengthText.props.children).toBe("Strong");

    fireEvent.changeText(passwordInput, "VeryStrong1!");
    expect(passwordStrengthText.props.children).toBe("Very Strong");
  });

  it("handles image picker correctly", async () => {
    const { getByTestId } = render(
      <OperatorSignUp navigation={{ navigate: jest.fn() }} />
    );
    const uploadPhotoButton = getByTestId("upload-photo-button");

    fireEvent.press(uploadPhotoButton);
  });
});
