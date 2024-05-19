import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import ChatScreen from "../src/components/Knaight";

describe("ChatScreen", () => {
  it("sends a message", async () => {
    jest.useFakeTimers();
    const { getByPlaceholderText, getByText, queryByTestId, getByTestId } =
      render(<ChatScreen />);

    const messagesList = getByTestId("messages-list");
    expect(messagesList).toBeDefined();

    const input = getByPlaceholderText("Type a message...");
    const sendButton = getByText("Send");

    fireEvent.changeText(input, "Hello");
    fireEvent.press(sendButton);

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    // Wait for the message to be sent and the response to be received
    await waitFor(() => {
      expect(queryByTestId("loading-indicator")).toBeNull();
      expect(getByText("Hello")).toBeTruthy();
    });
  });
});
