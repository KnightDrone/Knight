import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./../app/Login";
import SignUp from "./../app/SignUp";
import ForgotPassword from "./../app/ForgotPassword";
import OrderPlaced from "./../app/OrderPlaced";
import OrderMenu from "../app/OrderMenu";
import Map from "../app/Map";
import { UserDrawer } from "./DrawerNavigation";
import { HeaderBackButton } from "@react-navigation/elements";
import { NavigationContainer } from "@react-navigation/native";

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  OrderMenu: undefined;
  OrderPlaced: undefined;
  Map: undefined;
  UserDrawer: undefined;
};

const { Navigator, Screen, Group } = createStackNavigator<RootStackParamList>();

interface AppStackProps {
  isLoggedIn: any;
  user: any; // Define a more specific type if possible
}
export const AppStack: React.FC<AppStackProps> = ({ isLoggedIn, user }) => {
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
            {(props: any) => <SignUp {...props} />}
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
          <Screen name="Map" options={{ title: "Map for User" }}>
            {(props: any) => <Map {...props} />}
          </Screen>
          <Screen
            name="OrderMenu"
            options={({ navigation }: any) => ({
              headerShown: true,
              headerTransparent: true,
              headerTitle: "",
              headerLeft: () => (
                <HeaderBackButton
                  onPress={() => navigation.navigate("Map")}
                  labelVisible={false}
                  testID="order-menu-back-button"
                />
              ),
            })}
          >
            {(props: any) => <OrderMenu {...props} />}
          </Screen>
          <Screen name="OrderPlaced">
            {(props: any) => <OrderPlaced {...props} />}
          </Screen>
          <Screen name="UserDrawer" component={UserDrawer} />
        </Group>
        {/** Add more groups here **/}
      </Navigator>
    </NavigationContainer>
  );
};
