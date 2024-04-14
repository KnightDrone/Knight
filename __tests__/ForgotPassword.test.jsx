import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import ForgotPasswordScreen from "../src/app/ForgotPassword";
import { sendPasswordResetEmail } from "firebase/auth";

// Avoid useless error messages
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("ForgotPasswordScreen Component", () => {
  it("renders correctly", () => {
    const { getByTestId, getByText } = render(<ForgotPasswordScreen />);
    const titleText = getByTestId("title-text");
    expect(titleText).toBeTruthy();

    const emailText = getByTestId("email-text");
    expect(emailText).toBeTruthy();

    const emailInput = getByTestId("email-input");
    expect(emailInput).toBeTruthy();

    const resetButton = getByText("Reset Password");
    expect(resetButton).toBeTruthy();
  });

  it("updates email field correctly", () => {
    const { getByTestId } = render(<ForgotPasswordScreen />);
    const emailInput = getByTestId("email-input");
    fireEvent.changeText(emailInput, "test@example.com");
    expect(emailInput.props.value).toBe("test@example.com");
  });

  it("displays an error message when attempting to reset password without email", () => {
    const { getByText, getByTestId } = render(<ForgotPasswordScreen />);
    const resetButton = getByText("Reset Password");
    fireEvent.press(resetButton);
    const errorMessage = getByTestId("error-message");
    expect(errorMessage).toBeTruthy();
  });
});

describe("More ForgotPassword Component Tests", () => {
  it("informs the user after a successful email submission", async () => {
    const { getByText, getByTestId } = render(<ForgotPasswordScreen />);

    const emailInput = getByTestId("email-input");
    fireEvent.changeText(emailInput, "user@example.com");

    fireEvent.press(getByText("Reset Password"));
    await waitFor(() => expect(getByTestId("success-message")).toBeTruthy());
  });

  it("displays an error message if the email is not recognized", async () => {
    // Mock the API call within handleForgotPassword to reject
    sendPasswordResetEmail.mockImplementationOnce(() =>
      Promise.reject(new Error("User not found"))
    );

    // Adjust this based on your actual implementation
    const { getByText, getByTestId, findByText } = render(
      <ForgotPasswordScreen />
    );

    const emailInput = getByTestId("email-input");
    fireEvent.changeText(emailInput, "unknown@example.com");

    fireEvent.press(getByText("Reset Password"));

    // Assuming the component shows an error message upon API call failure
    const errorMessage = await findByText("User not found");

    expect(errorMessage).toBeTruthy();
    // args are: (auth, email)
    // auth is undefined
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      undefined,
      "unknown@example.com"
    );
  });
});
