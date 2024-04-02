import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Button from "../src/components/Button";

describe("Button", () => {
  it("renders correctly with a title", () => {
    const { getByText } = render(
      <Button title="Press me" onPress={() => {}} />
    );
    expect(getByText("Press me")).toBeTruthy();
  });

  it("calls the onPress handler when pressed", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Press me" onPress={onPressMock} />
    );
    fireEvent.press(getByText("Press me"));
    expect(onPressMock).toHaveBeenCalled();
  });
});
