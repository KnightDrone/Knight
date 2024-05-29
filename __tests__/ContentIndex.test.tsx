import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { useTranslation } from "react-i18next";
import { ContentIndex } from "../src/app/content/ContentIndex";
import { Button } from "../src/ui/Button";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("ContentIndex", () => {
  const mockedNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText } = render(
      <ContentIndex navigation={mockedNavigation} />
    );
    expect(getByText("content.title")).toBeTruthy();
    expect(getByText("content.guide-1.title")).toBeTruthy();
    expect(getByText("content.guide-2.title")).toBeTruthy();
    expect(getByText("content.guide-3.title")).toBeTruthy();
    expect(getByText("content.guide-4.title")).toBeTruthy();
    expect(getByText("content.guide-5.title")).toBeTruthy();
  });

  it("navigates to Guide1 when the first button is pressed", () => {
    const { getByTestId } = render(
      <ContentIndex navigation={mockedNavigation} />
    );
    fireEvent.press(getByTestId("guide-1-button"));
    expect(mockedNavigation.navigate).toHaveBeenCalledWith("Guide1");
  });

  it("navigates to Guide2 when the second button is pressed", () => {
    const { getByTestId } = render(
      <ContentIndex navigation={mockedNavigation} />
    );
    fireEvent.press(getByTestId("guide-2-button"));
    expect(mockedNavigation.navigate).toHaveBeenCalledWith("Guide2");
  });

  it("navigates to Guide3 when the third button is pressed", () => {
    const { getByTestId } = render(
      <ContentIndex navigation={mockedNavigation} />
    );
    fireEvent.press(getByTestId("guide-3-button"));
    expect(mockedNavigation.navigate).toHaveBeenCalledWith("Guide3");
  });

  it("navigates to Guide4 when the fourth button is pressed", () => {
    const { getByTestId } = render(
      <ContentIndex navigation={mockedNavigation} />
    );
    fireEvent.press(getByTestId("guide-4-button"));
    expect(mockedNavigation.navigate).toHaveBeenCalledWith("Guide4");
  });

  it("navigates to Guide5 when the fifth button is pressed", () => {
    const { getByTestId } = render(
      <ContentIndex navigation={mockedNavigation} />
    );
    fireEvent.press(getByTestId("guide-5-button"));
    expect(mockedNavigation.navigate).toHaveBeenCalledWith("Guide5");
  });
});
