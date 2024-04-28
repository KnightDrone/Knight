import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./../app/Login";
import SignUp from "./../app/SignUp";
import ForgotPassword from "./../app/ForgotPassword";
import OrderPlaced from "./../app/OrderPlaced";
import OrderMenu from "../app/OrderMenu";
import MapOverview from "../app/MapOverview";
import { UserDrawer } from "./DrawerNavigation";
import Icon from "react-native-vector-icons/Ionicons";

import { HeaderBackButton } from "@react-navigation/elements";

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  OrderMenu: undefined;
  OrderPlaced: undefined;
  Drawer: undefined;
  MapOverview: undefined;
  UserStack: undefined;
};

const { Navigator, Screen } = createStackNavigator<RootStackParamList>();

export const AuthStack = () => {
  return (
    <Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Screen name="Login" component={Login} />
      <Screen name="SignUp" component={SignUp} />
      <Screen name="ForgotPassword" component={ForgotPassword} />
      <Screen name="UserStack" component={UserStack} />
    </Navigator>
  );
};

export const UserStack = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="Drawer" component={UserDrawer} />
      <Screen name="MapOverview" component={MapOverview} />
      <Screen
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
      <Screen name="OrderPlaced" component={OrderPlaced} />
    </Navigator>
  );
};
