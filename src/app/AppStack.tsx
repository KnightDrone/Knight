import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { HeaderBackButton } from "@react-navigation/elements";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList } from "../types/RootStackParamList";
import { DrawerParamList } from "../types/DrawerParamList";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Stack Navigation Screens
import { User } from "../services/Firebase";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import ForgotPassword from "./auth/ForgotPassword";
import OrderPlaced from "./order/OrderPlaced";
import OrderMenu from "./order/OrderMenu";
import PendingOrders from "./order/PendingOrders";
import MapOverview from "./Map";

// Drawer Navigation Screens
import Profile from "./settings/ProfileScreen";
import Setting from "./settings/Setting";
import OrderHistory from "./order/OrderHistory";

const { Navigator, Screen, Group } = createStackNavigator<RootStackParamList>();

const Drawer = createDrawerNavigator<DrawerParamList>();

interface UserDrawerProps {
  user?: User | null;
}

function UserDrawer<UserDrawerProps>(user: UserDrawerProps) {
  return (
    <Drawer.Navigator initialRouteName="Map">
      <Drawer.Screen name="Map" options={{ headerShown: false }}>
        {(props: any) => <MapOverview {...props} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Profile"
        options={({ navigation }: any) => ({
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => navigation.toggleDrawer()}
              labelVisible={false}
              testID="profile-drawer-button" // Ensure this testID is correctly set
            />
          ),
        })}
      >
        {(props: any) => {
          return <Profile {...props} />;
        }}
      </Drawer.Screen>
      <Drawer.Screen
        name="Settings"
        options={({ navigation }: any) => ({
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => navigation.toggleDrawer()}
              labelVisible={false}
              testID="settings-back-button"
            />
          ),
        })}
      >
        {(props: any) => <Setting {...props} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="OrderMenu"
        options={({ navigation }: any) => ({
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => navigation.toggleDrawer()}
              labelVisible={false}
              testID="order-menu-drawer-back-button"
            />
          ),
        })}
      >
        {(props: any) => <OrderMenu {...props} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="OrderHistory"
        options={({ navigation }: any) => ({
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => navigation.toggleDrawer()}
              labelVisible={false}
              testID="order-history-back-button"
            />
          ),
        })}
      >
        {(props: any) => (
          <OrderHistory
            {...props}
            route={{ params: { historyOp: false, user } }}
          />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

interface AppStackProps {
  isLoggedIn: "Login" | "UserDrawer";
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
        </Group>
        <Group>
          <Screen name="UserDrawer">
            {(props: any) => <UserDrawer {...props} user={{ user }} />}
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
