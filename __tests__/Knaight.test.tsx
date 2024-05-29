import React, { createContext, useLayoutEffect } from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import ChatScreen from "../src/components/Knaight";

jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    useLayoutEffect: jest.fn(),
  };
});

jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: () => ({
      setOptions: jest.fn(),
    }),
  };
});

describe("ChatScreen", () => {
  it("sends a message", async () => {
    jest.useFakeTimers();

    const { getByPlaceholderText, getByText, queryByTestId, getByTestId } =
      render(<ChatScreen />);

    const messagesList = getByTestId("messages-list");
    expect(messagesList).toBeDefined();

    const input = getByTestId("message-input");
    const sendButton = getByTestId("send-button");

    fireEvent.changeText(input, "Hello");
    fireEvent.press(sendButton);

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // Wait for the message to be sent and the response to be received
    await waitFor(() => {
      expect(queryByTestId("loading-indicator")).toBeNull();
      // expect(getByText("Hello")).toBeTruthy();
    });
  });
});
