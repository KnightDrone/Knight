import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import ForgotPassword from "./auth/ForgotPassword";
import OrderPlaced from "./order/OrderPlaced";
import OrderMenu from "./order/OrderMenu";
import MapOverview from "./Map";
import { HeaderBackButton } from "@react-navigation/elements";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList } from "../types/RootStackParamList";

import { User } from "../services/Firebase";
import OrderHistory from "./order/OrderHistory";
import Settings from "./settings/Setting";
import ProfileScreen from "./settings/ProfileScreen";
import OperatorMap from "./OperatorMap";

const { Navigator, Screen, Group } = createStackNavigator<RootStackParamList>();

interface AppStackProps {
  isLoggedIn: "Login" | "Map";
  user?: User | null; // Define a more specific type if possible
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
            {(props: any) => <MapOverview {...props} />}
          </Screen>
          <Screen name="OperatorMap" options={{ title: "Map for Operator" }}>
            {(props: any) => <OperatorMap {...props} />}
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
          <Screen name="OrderHistory">
            {(props: any) => <OrderHistory {...props} />}
          </Screen>
          <Screen
            name="Settings"
            options={({ navigation }: any) => ({
              headerShown: true,
              headerTitle: "Settings",
              headerLeft: () => (
                <HeaderBackButton
                  onPress={() => navigation.goBack()}
                  labelVisible={false}
                  labelStyle={{ color: "black" }}
                  testID="settings-back-button"
                />
              ),
            })}
          >
            {(props: any) => <Settings {...props} />}
          </Screen>
          <Screen
            name="ProfileScreen"
            options={({ navigation }: any) => ({
              headerShown: true,
              headerTitle: "Edit Profile",
              headerLeft: () => (
                <HeaderBackButton
                  onPress={() => navigation.goBack()}
                  labelVisible={false}
                  labelStyle={{ color: "black" }}
                  testID="Profile-back-button"
                />
              ),
            })}
          >
            {(props: any) => <ProfileScreen {...props} />}
          </Screen>
        </Group>
      </Navigator>
    </NavigationContainer>
  );
};
