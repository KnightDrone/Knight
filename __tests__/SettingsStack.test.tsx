import React from "react";
import { render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SettingsStack } from "../src/app/settings/SettingsStack";

describe("SettingsStack", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <NavigationContainer>
        <SettingsStack userId="testUserId" />
      </NavigationContainer>
    );

    expect(getByText("Settings")).toBeTruthy();
    expect(getByText("Edit profile")).toBeTruthy();
    expect(getByText("FAQs")).toBeTruthy();
    expect(getByText("TermsAndConditions")).toBeTruthy();
    expect(getByText("Privacy")).toBeTruthy();
    expect(getByText("Notifications")).toBeTruthy();
  });
});
