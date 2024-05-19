import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { HeaderBackButton } from "@react-navigation/elements";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList } from "../types/RootStackParamList";
import OperatorSignup from "./auth/OperatorSignup";

// Stack Navigation Screens
import { User } from "../services/Firebase";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import ForgotPassword from "./auth/ForgotPassword";
import OrderPlaced from "./order/OrderPlaced";
import PendingOrders from "./order/PendingOrders";

import { UserDrawer } from "../components/drawers/UserDrawer";
import { OperatorDrawer } from "../components/drawers/OperatorDrawer";

const { Navigator, Screen, Group } = createStackNavigator<RootStackParamList>();

interface AppStackProps {
  isLoggedIn: "Login" | "UserDrawer" | "OperatorDrawer";
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
                  onPress={() => navigation.popToTop()}
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
                  onPress={() => navigation.popToTop()}
                  labelVisible={false}
                  testID="forgot-password-back-button"
                />
              ),
            })}
          />
          <Screen
            name="OperatorSignup"
            options={({ navigation }: any) => ({
              headerShown: true,
              headerTransparent: true,
              headerTitle: "",
              headerLeft: () => (
                <HeaderBackButton
                  onPress={() => navigation.popToTop()}
                  labelVisible={false}
                  testID="operator-signup-back-button"
                />
              ),
            })}
          >
            {(props: any) => <OperatorSignup {...props} />}
          </Screen>
        </Group>
        <Group>
          <Screen name="UserDrawer">
            {(props: any) => <UserDrawer {...props} user={{ user }} />}
          </Screen>
          <Screen name="OperatorDrawer">
            {(props: any) => <OperatorDrawer {...props} />}
          </Screen>
          <Screen name="OrderPlaced">
            {(props: any) => <OrderPlaced {...props} />}
          </Screen>
          <Screen name="PendingOrders">
            {(props: any) => <PendingOrders {...props} />}
          </Screen>
        </Group>
      </Navigator>
    </NavigationContainer>
  );
};
