import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./../app/Login";
import SignUp from "./../app/SignUp";
import ForgotPassword from "./../app/ForgotPassword";
import OrderPlaced from "./../app/OrderPlaced";
import OrderMenu from "../app/OrderMenu";
import Map from "../app/Map";
import Icon from "react-native-vector-icons/Ionicons";

import { HeaderBackButton } from "@react-navigation/elements";
import { NavigationContainer } from "@react-navigation/native";

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  OrderMenu: undefined;
  OrderPlaced: undefined;
  Map: undefined;
  UserStack: undefined;
};

const { Navigator, Screen, Group } = createStackNavigator<RootStackParamList>();

export default function AppStack(isLoggedIn: any, user: any) {
  console.log(isLoggedIn);
  return (
    <NavigationContainer>
      <Navigator
        initialRouteName={isLoggedIn}
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "#f9f9f9",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Group>
          <Screen name="Login" options={{ title: "Login to Wild Knight" }}>
            {(props: any) => <Login {...props} />}
          </Screen>
          <Screen
            name="SignUp"
            options={({ navigation }: any) => ({
              headerShown: true,
              headerTransparent: true,
              headerTitle: "",
              headerLeft: () => (
                <HeaderBackButton
                  onPress={() => navigation.navigate("Login")}
                  labelVisible={false}
                  testID="sign-up-back-button"
                />
              ),
            })}
          >
            {(props) => <SignUp {...props} />}
          </Screen>
          <Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={({ navigation }: any) => ({
              headerShown: true,
              headerTransparent: true,
              headerTitle: "",
              headerLeft: () => (
                <HeaderBackButton
                  onPress={() => navigation.navigate("Login")}
                  labelVisible={false}
                  testID="forgot-password-back-button"
                />
              ),
            })}
          />
        </Group>
        <Group>
          <Screen name="Map">{(props) => <Map {...props} />}</Screen>
          <Screen
            name="OrderMenu"
            options={({ navigation }: any) => ({
              headerShown: true,
              headerTransparent: true,
              headerTitle: "",
              headerLeft: () => (
                <HeaderBackButton
                  onPress={() => navigation.navigate("Map")}
                  backImage={() => (
                    <Icon name="arrow-back" size={24} color="black" />
                  )}
                  labelVisible={false}
                  testID="order-menu-back-button"
                />
              ),
            })}
          >
            {(props) => <OrderMenu {...props} />}
          </Screen>
          <Screen name="OrderPlaced">
            {(props) => <OrderPlaced {...props} />}
          </Screen>
        </Group>
        {/** Add more groups here **/}
      </Navigator>
    </NavigationContainer>
  );
}
