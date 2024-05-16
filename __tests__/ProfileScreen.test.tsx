import React from "react";
import ProfileScreen from "../src/app/settings/ProfileScreen";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { User } from "../src/types/User";

beforeAll(() => {
  global.alert = jest.fn();
});

jest.mock("../src/services/Firebase", () => {
  return {
    auth: {
      currentUser: {
        uid: "07b35de9-7f42-4d5c-9953-e8c586c349d2",
      },
    },
  };
});

jest.mock("../src/services/FirestoreManager", () => {
  return jest.fn().mockImplementation(() => {
    return {
      readData: jest.fn().mockImplementation(() => {
        return new User("2", "jane@example.com", false, "Jane Doe");
      }),
      updateData: jest.fn(),
    };
  });
});

describe("ProfileScreen", () => {
  it("renders all inputs and buttons", () => {
    const { getByPlaceholderText } = render(<ProfileScreen />);

    expect(getByPlaceholderText("Name")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByPlaceholderText("DD/MM/YYYY")).toBeTruthy();
  });

  it("allows input to be entered", async () => {
    const { getByPlaceholderText } = render(<ProfileScreen />);

    fireEvent.changeText(getByPlaceholderText("Name"), "Jane Doe");
    await waitFor(() =>
      expect(getByPlaceholderText("Name").props.value).toBe("Jane Doe")
    );
    fireEvent.changeText(getByPlaceholderText("Email"), "jane@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "newpassword");
    fireEvent.changeText(getByPlaceholderText("DD/MM/YYYY"), "01/01/1990");
  });

  it("handles save button press", async () => {
    const { getByTestId, getByPlaceholderText } = render(<ProfileScreen />);
    const saveButton = getByTestId("save-button");
    fireEvent.press(saveButton);

    fireEvent.changeText(getByPlaceholderText("Email"), "janexample.com");
    fireEvent.press(saveButton);
    fireEvent.changeText(getByPlaceholderText("Email"), "jane@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "newpassword");
    fireEvent.press(saveButton);
  });
});

describe("ProfileScreen Component", () => {
  it("renders all inputs and buttons", () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText("Name")).toBeTruthy();
    expect(getByText("Email")).toBeTruthy();
    expect(getByText("Password")).toBeTruthy();
    expect(getByText("Save changes")).toBeTruthy();
  });

  it("allows input to be entered", () => {
    render(<ProfileScreen />);
  });

  it("handles save button press", () => {
    const { getByTestId } = render(<ProfileScreen />);
    const saveButton = getByTestId("save-button");
    fireEvent.press(saveButton);
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
  });

  it("opens the date picker when date input is pressed", () => {
    const { getByPlaceholderText } = render(<ProfileScreen />);
    const dobInput = getByPlaceholderText("DD/MM/YYYY");
    fireEvent.press(dobInput);
    // Check for DatePicker visibility if it is state-based or mocked
  });
});
