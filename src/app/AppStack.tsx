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

// Back button
import BackButton from "../components/buttons/BackButton";
import { ContentIndex } from "./content/ContentIndex";

import Guide1 from "./content/Guide1";
import Guide2 from "./content/Guide2";
import Guide3 from "./content/Guide3";
import Guide4 from "./content/Guide4";
import Guide5 from "./content/Guide5";
import TermsAndConditions from "./settings/TermsAndConditions";
import ProfileScreen from "./settings/ProfileScreen";
import PrivacyScreen from "./settings/PrivacyScreen";
import FAQs from "./settings/FAQs";
import NotificationsScreen from "./settings/NotificationsScreen";

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
            name="ContentIndex"
            options={{ title: "Wild Knight's Hiker Guide" }}
          >
            {(props: any) => <ContentIndex {...props} />}
          </Screen>
          <Screen
            name="Guide1"
            options={{ title: "Wild Knight's Hiker Guide" }}
          >
            {(props: any) => <Guide1 {...props} />}
          </Screen>
          <Screen
            name="Guide2"
            options={{ title: "Wild Knight's Hiker Guide" }}
          >
            {(props: any) => <Guide2 {...props} />}
          </Screen>
          <Screen
            name="Guide3"
            options={{ title: "Wild Knight's Hiker Guide" }}
          >
            {(props: any) => <Guide3 {...props} />}
          </Screen>
          <Screen
            name="Guide4"
            options={{ title: "Wild Knight's Hiker Guide" }}
          >
            {(props: any) => <Guide4 {...props} />}
          </Screen>
          <Screen
            name="Guide5"
            options={{ title: "Wild Knight's Hiker Guide" }}
          >
            {(props: any) => <Guide5 {...props} />}
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
          <Screen
            options={{
              headerShown: true,
              headerBackTitle: "Back",
            }}
            name="FAQs"
            component={FAQs}
          />
          <Screen
            options={{
              headerShown: true,
              headerBackTitle: "Back",
            }}
            name="TermsAndConditions"
            component={TermsAndConditions}
          />
          <Screen
            options={{
              headerShown: true,
              headerBackTitle: "Back",
            }}
            name="Privacy"
            component={PrivacyScreen}
          />
          <Screen
            options={{
              headerShown: true,
              headerBackTitle: "Back",
            }}
            name="Notifications"
            component={NotificationsScreen}
          />
        </Group>
      </Navigator>
    </NavigationContainer>
  );
};
