import React from "react";
import {
  screen,
  render,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react-native";
import MapOverview from "../src/app/Map";
import * as Location from "expo-location";
import { Text } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

const fakeLocation = {
  coords: {
    latitude: 34.0522,
    longitude: -118.2437,
    altitude: 0,
    accuracy: 5,
    altitudeAccuracy: 5,
    heading: null,
    speed: null,
  },
  timestamp: Date.now(),
};

const initialRegion = {
  latitude: 37.789,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

jest.mock("react-native-vector-icons/MaterialIcons", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: jest.fn().mockImplementation((props) => <View {...props} />),
  };
});

describe("MapOverview Component", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"Map"}>
          <Stack.Screen name="Map">
            {(props) => <MapOverview {...props} />}
          </Stack.Screen>
          <Stack.Screen name="OrderMenu">
            {() => (
              <>
                <Text testID="order-menu-screen">Order Menu Screen</Text>
              </>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(getByTestId("map-view")).toBeTruthy();
    expect(getByTestId("get-location-button")).toBeTruthy();
    expect(getByTestId("order-button")).toBeTruthy();
  });

  it("navigates to OrderMenu when order button is pressed", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"Map"}>
          <Stack.Screen name="Map">
            {(props) => <MapOverview {...props} />}
          </Stack.Screen>
          <Stack.Screen name="OrderMenu">
            {() => (
              <>
                <Text testID="order-menu-screen">Order Menu Screen</Text>
              </>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );

    fireEvent.press(getByTestId("order-button"));

    await waitFor(() =>
      expect(screen.getByTestId("order-menu-screen")).toBeTruthy()
    );
  });

  it("fails to fetch location when location permission is denied", async () => {
    jest.useFakeTimers();
    const { getByTestId } = render(
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"Map"}>
          <Stack.Screen name="Map">
            {(props) => <MapOverview {...props} />}
          </Stack.Screen>
          <Stack.Screen name="OrderMenu">
            {() => (
              <>
                <Text testID="order-menu-screen">Order Menu Screen</Text>
              </>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );

    act(() => {
      jest.runAllTimers();
    });

    // Deny location permission
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({
      status: "denied",
    });

    // Invoke the location fetch action
    const locationButton = getByTestId("get-location-button"); // Ensure your button has the 'testID' prop
    fireEvent.press(locationButton);

    // Wait for the effects to apply
    await waitFor(() =>
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled()
    );
    await waitFor(() =>
      expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled()
    );

    // Check if the map region and marker have not been updated
    expect(getByTestId("map-view").props.region).toEqual(initialRegion);

    // Assuming Marker component is also receiving the updated props
    expect(getByTestId("map-marker").props.coordinate).toEqual({
      latitude: initialRegion.latitude,
      longitude: initialRegion.longitude,
    });
  });

  it("updates region and marker on successful location fetch", async () => {
    jest.useFakeTimers();
    const { getByTestId } = render(
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"Map"}>
          <Stack.Screen name="Map">
            {(props) => <MapOverview {...props} />}
          </Stack.Screen>
          <Stack.Screen name="OrderMenu">
            {() => (
              <>
                <Text testID="order-menu-screen">Order Menu Screen</Text>
              </>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );

    act(() => {
      jest.runAllTimers();
    });

    // Invoke the location fetch action
    const locationButton = getByTestId("get-location-button"); // Ensure your button has the 'testID' prop
    fireEvent.press(locationButton);

    // Wait for the effects to apply
    await waitFor(() =>
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled()
    );
    await waitFor(() =>
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled()
    );

    // Check if the map region and marker have been updated
    expect(getByTestId("map-view").props.region).toEqual({
      latitude: fakeLocation.coords.latitude,
      longitude: fakeLocation.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });

    // Assuming Marker component is also receiving the updated props
    expect(getByTestId("map-marker").props.coordinate).toEqual({
      latitude: fakeLocation.coords.latitude,
      longitude: fakeLocation.coords.longitude,
    });
  });
});
