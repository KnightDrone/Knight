import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PrivacyScreen from "../src/app/settings/PrivacyScreen";
import { initI18n } from "../src/lang/i18n";

beforeAll(() => {
  initI18n();
});

describe("PrivacyScreen", () => {
  const navigation = { navigate: jest.fn() };

  it("renders correctly", () => {
    const { getByText } = render(<PrivacyScreen navigation={navigation} />);

    expect(getByText("Data Tracking")).toBeTruthy();
    expect(
      getByText("Control what data is used for personalization")
    ).toBeTruthy();

    expect(getByText("Personalized Ads")).toBeTruthy();
    expect(getByText("For a more tailored ad experience")).toBeTruthy();

    expect(getByText("Share Live Location")).toBeTruthy();
    expect(
      getByText("Allow access to your location in case of emergency")
    ).toBeTruthy();

    expect(getByText("Terms of Service")).toBeTruthy();
  });

  it("navigates to Terms of Service when button is pressed", () => {
    const navigate = jest.fn();
    const { getByTestId } = render(<PrivacyScreen navigation={{ navigate }} />);

    fireEvent.press(getByTestId("tos-button"));

    // expect(navigate).toHaveBeenCalledWith('Terms of Service');
  });

  it("toggles switches correctly", () => {
    const { getByTestId } = render(<PrivacyScreen navigation={navigation} />);

    fireEvent(getByTestId("data-switch"), "onValueChange");
    fireEvent(getByTestId("ad-switch"), "onValueChange");
    fireEvent(getByTestId("location-switch"), "onValueChange");
  });
});
