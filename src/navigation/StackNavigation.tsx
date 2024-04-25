import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import { HeaderBackButton } from "@react-navigation/elements";

// Screens
// User
import Login from "./../app/Login";
import SignUp from "./../app/SignUp";
import ForgotPassword from "./../app/ForgotPassword";
import OrderPlaced from "./../app/OrderPlaced";
import OrderMenu from "../app/OrderMenu";
import Map from "../app/Map";
import { UserDrawer } from "./DrawerNavigation";

// Operator
// TODO ADD OPERATOR SCREENS
//

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  OrderMenu: undefined;
  OrderPlaced: undefined;
  Drawer: undefined;
  Map: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const RootStack = createStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="Drawer" component={UserDrawer} /> */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={({ navigation }) => ({
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => navigation.goBack()}
              backImage={() => (
                <Icon name="arrow-back" size={24} color="black" />
              )}
              labelVisible={false}
              testID="order-placed-back-button"
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export const UserStack = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {
        <>
          <RootStack.Screen name="Drawer" component={UserDrawer} />
          <RootStack.Screen
            name="OrderMenu"
            component={OrderMenu}
            options={({ navigation }) => ({
              headerShown: true,
              headerTransparent: true,
              headerTitle: "",
              headerLeft: () => (
                <HeaderBackButton
                  onPress={() => navigation.goBack()}
                  backImage={() => (
                    <Icon name="arrow-back" size={24} color="black" />
                  )}
                  labelVisible={false}
                  testID="ordermenu-back-button"
                />
              ),
            })}
          />
          <RootStack.Screen
            name="OrderPlaced"
            component={OrderPlaced}
            options={({ navigation }) => ({
              headerShown: true,
              headerTransparent: true,
              headerTitle: "",
              headerLeft: () => (
                <HeaderBackButton
                  onPress={() => navigation.goBack()}
                  backImage={() => (
                    <Icon name="arrow-back" size={24} color="black" />
                  )}
                  labelVisible={false}
                  testID="order-placed-back-button"
                />
              ),
            })}
          />
        </>
      }
    </RootStack.Navigator>
  );
};
