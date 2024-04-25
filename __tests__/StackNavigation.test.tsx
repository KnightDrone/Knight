import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  StackScreenProps,
} from "@react-navigation/stack";
// Import your components
import Login from "../src/app/Login";
import ForgotPassword from "../src/app/ForgotPassword";
import SignUp from "../src/app/SignUp";
import OrderMenu from "../src/app/OrderMenu";
// Define the stack navigator type
type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  SignUp: undefined;
  OrderMenu: undefined;
  Map: undefined;
};
const Stack = createStackNavigator<RootStackParamList>();
// Mock the useFonts hook if necessary
jest.mock("../__mocks__/expo-font", () => ({
  useFonts: jest.fn().mockReturnValue([true]),
}));
describe("Navigation Tests", () => {
  it("should render the Login screen as the initial route", async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="OrderMenu" component={OrderMenu} />
          <Stack.Screen name="Map">
            {() => <Text testID="map-screen">Map Screen</Text>}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
    await waitFor(() => {
      expect(getByText("Login")).toBeTruthy();
    });
  });
  it("should navigate to the SignUp screen when navigated explicitly", async () => {
    const { getByText, findByText } = render(
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="OrderMenu" component={OrderMenu} />
          <Stack.Screen name="Map">
            {() => <Text testID="map-screen">Map Screen</Text>}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
    fireEvent.press(getByText("Go to SignUp"));
    expect(await findByText("SignUp")).toBeTruthy();
  });
  it("should navigate to the ForgotPassword screen when the forgot password button is pressed", async () => {
    const { getByText, findByText } = render(
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="OrderMenu" component={OrderMenu} />
          <Stack.Screen name="Map">
            {() => <Text testID="map-screen">Map Screen</Text>}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
    fireEvent.press(getByText("Forgot Password?"));
    expect(await findByText("ForgotPassword")).toBeTruthy();
  });
  it("should navigate to the OrderMenu screen when the order menu button is pressed", async () => {
    const { getByText, findByText } = render(
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="OrderMenu" component={OrderMenu} />
          <Stack.Screen name="Map">
            {() => <Text testID="map-screen">Map Screen</Text>}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
    fireEvent.press(getByText("Order Menu"));
    expect(await findByText("OrderMenu")).toBeTruthy();
  });
});
