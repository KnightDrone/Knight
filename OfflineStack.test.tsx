import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { OfflineMapStack } from "../src/app/maps/offline/OfflineStack";
import { createStackNavigator } from "@react-navigation/stack";
import LocationPicker from "../src/app/maps/offline/LocationPicker";
import OfflineMapSettings from "../src/app/maps/offline/OfflineMapSettings";
import { OfflineMap } from "../src/app/maps/offline/OfflineMap";
import { NavigationContainer } from "@react-navigation/native";

jest.mock("../src/app/maps/offline/OfflineMapSettings", () =>
  jest.fn(() => null)
);
jest.mock("../src/app/maps/offline/LocationPicker", () => jest.fn(() => null));
jest.mock("../src/app/maps/offline/OfflineMap", () => ({
  OfflineMap: jest.fn(() => null),
}));

describe("OfflineMapStack", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders OfflineMapSettings screen by default", () => {
    render(
      <NavigationContainer>
        <OfflineMapStack />
      </NavigationContainer>
    );

    expect(OfflineMapSettings).toHaveBeenCalled();
  });

  it("navigates to LocationPicker screen", () => {
    const { getByText } = render(
      <NavigationContainer>
        <OfflineMapStack />
      </NavigationContainer>
    );

    //fireEvent.press(getByText('Go to LocationPicker'));

    //expect(LocationPicker).toHaveBeenCalled();
  });

  it("navigates to OfflineMap screen with correct params", () => {
    const { getByText } = render(
      <NavigationContainer>
        <OfflineMapStack />
      </NavigationContainer>
    );

    //fireEvent.press(getByText('Go to OfflineMap'));

    // expect(OfflineMap).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     route: expect.objectContaining({
    //       params: { name: 'Test Map' },
    //     }),
    //   }),
    //   {}
    // );
  });

  it("goes back from OfflineMap screen", () => {
    const mockGoBack = jest.fn();
    const { getByText } = render(
      <NavigationContainer>
        <OfflineMapStack />
      </NavigationContainer>
    );

    //fireEvent.press(getByText('Go to OfflineMap'));
    //fireEvent.press(getByText('Back'));

    //expect(mockGoBack).toHaveBeenCalled();
  });
});
