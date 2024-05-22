import React from "react";
import { render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SettingsStack } from "../src/app/settings/SettingsStack";

jest.mock("../src/services/Firebase", () => ({
  auth: {
    currentUser: {
      uid: "testUserId",
    },
  },
}));

jest.mock("../src/services/FirestoreManager.ts", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        writeData: jest.fn().mockResolvedValue({}),
        queryData: jest.fn().mockResolvedValue([]),
        queryOrder: jest.fn().mockResolvedValue([]),
        getUser: jest.fn().mockResolvedValue({}),
        createUser: jest.fn().mockResolvedValue({}),
      };
    }),
  };
});

describe("SettingsStack", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <NavigationContainer>
        <SettingsStack userId="testUserId" />
      </NavigationContainer>
    );

    expect(getByText("Edit profile")).toBeTruthy();
    expect(getByText("FAQs")).toBeTruthy();
    expect(getByText("TermsAndConditions")).toBeTruthy();
    expect(getByText("Privacy")).toBeTruthy();
    expect(getByText("Notifications")).toBeTruthy();
  });
});
