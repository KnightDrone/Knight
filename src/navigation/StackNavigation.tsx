import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./../app/Login";
import SignUp from "./../app/SignUp";
import ForgotPassword from "./../app/ForgotPassword";
import OrderPlaced from "./../app/OrderPlaced";
import OrderMenu from "../app/OrderMenu";
import { UserDrawer } from "./DrawerNavigation";
import Icon from "react-native-vector-icons/Ionicons";

import { HeaderBackButton } from "@react-navigation/elements";

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  OrderMenu: undefined;
  OrderPlaced: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const RootStack = createStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
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
                  testID="back-button"
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
                  testID="back-button"
                />
              ),
            })}
          />
        </>
      }
    </RootStack.Navigator>
  );
};

const StackNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="OrderMenu" component={OrderMenu} />
      <Stack.Screen
        name="OrderPlaced"
        component={OrderPlaced}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
