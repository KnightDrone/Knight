import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ProfileScreen from "../src/app/ProfileScreen";

jest.mock("../src/services/Firebase", () => {
  return {
    auth: {
      currentUser: {
        uid: "07b35de9-7f42-4d5c-9953-e8c586c349d2",
      },
    },
  };
});

describe("ProfileScreen", () => {
  it("renders all inputs and buttons", () => {
    const { getByPlaceholderText } = render(<ProfileScreen />);

    expect(getByPlaceholderText("Name")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByPlaceholderText("DD/MM/YYYY")).toBeTruthy();
  });

  it("allows input to be entered", () => {
    const { getByPlaceholderText } = render(<ProfileScreen />);

    fireEvent.changeText(getByPlaceholderText("Name"), "Jane Doe");
    expect(getByPlaceholderText("Name").props.value).toBe("Jane Doe");

    fireEvent.changeText(getByPlaceholderText("Email"), "jane@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "newpassword");
    fireEvent.changeText(getByPlaceholderText("DD/MM/YYYY"), "01/01/1990");
  });

  it("handles save button press", () => {
    const { getByText } = render(<ProfileScreen />);
    const saveButton = getByText("Save changes");
    fireEvent.press(saveButton);
    expect(global.alert).toHaveBeenCalledWith("Changes Saved!");
  });
});

// Mocking the global alert function
global.alert = jest.fn();

describe("ProfileScreen", () => {
  it("renders all inputs and buttons", () => {
    const { getByText, getByDisplayValue } = render(<ProfileScreen />);

    expect(getByText("Name")).toBeTruthy();
    expect(getByDisplayValue("Mock User")).toBeTruthy();
    expect(getByText("Email")).toBeTruthy();
    expect(getByDisplayValue("mockuser@gmail.com")).toBeTruthy();
    expect(getByText("Password")).toBeTruthy();
    expect(getByDisplayValue("**********")).toBeTruthy();
    expect(getByText("Save changes")).toBeTruthy();
  });

  it("allows input to be entered", () => {
    const { getByDisplayValue } = render(<ProfileScreen />);

    const nameInput = getByDisplayValue("Mock User");
    fireEvent.changeText(nameInput, "Jane Doe");
    expect(nameInput.props.value).toEqual("Jane Doe");
  });

  it("handles save button press", () => {
    const { getByText } = render(<ProfileScreen />);
    const saveButton = getByText("Save changes");
    fireEvent.press(saveButton);
    expect(global.alert).toHaveBeenCalledWith("Changes Saved!");
  });
});

describe("ProfileScreen", () => {
  it("renders all inputs and buttons", () => {
    const { getByText, getByPlaceholderText } = render(<ProfileScreen />);

    expect(getByText("Name")).toBeTruthy();
    expect(getByText("Email")).toBeTruthy();
    expect(getByText("Password")).toBeTruthy();
    expect(getByText("Date of Birth")).toBeTruthy();
    expect(getByText("Save changes")).toBeTruthy();

    expect(getByPlaceholderText("DD/MM/YYYY")).toBeTruthy();
  });

  it("allows input to be entered", () => {
    const { getByPlaceholderText, getByTestId } = render(<ProfileScreen />);
    const nameInput = getByPlaceholderText("Name");
    fireEvent.changeText(nameInput, "Jane Doe");

    const emailInput = getByPlaceholderText("Email");
    fireEvent.changeText(emailInput, "jane@example.com");

    const passwordInput = getByPlaceholderText("Password");
    fireEvent.changeText(passwordInput, "newpassword");

    const dobInput = getByPlaceholderText("DD/MM/YYYY");
    fireEvent.changeText(dobInput, "01/01/1990");

    expect(nameInput.props.value).toEqual("Jane Doe");
    expect(emailInput.props.value).toEqual("jane@example.com");
    expect(passwordInput.props.value).toEqual("newpassword");
    expect(dobInput.props.value).toEqual("01/01/1990");
  });

  it("handles save button press", () => {
    const { getByText } = render(<ProfileScreen />);
    const saveButton = getByText("Save changes");
    fireEvent.press(saveButton);
    // Check for alert or mock function if needed
  });

  it("opens the date picker when date input is pressed", () => {
    const { getByPlaceholderText } = render(<ProfileScreen />);
    const dobInput = getByPlaceholderText("DD/MM/YYYY");
    fireEvent.press(dobInput);
    // Check for DatePicker visibility if it is state-based or mocked
  });
});
