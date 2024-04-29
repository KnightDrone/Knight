import React from "react";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { HeaderBackButton } from "@react-navigation/elements";

//Add pages to add to the drawer
import Map from "./../app/Map";
import Profile from "./../app/Profile";
import Settings from "./../app/Settings";
import { NavigationContainer } from "@react-navigation/native";

export type UserDrawerParamList = {
  Map: undefined;
  Profile: undefined;
  Settings: undefined;
};

const { Navigator, Screen } = createDrawerNavigator<UserDrawerParamList>();

export const UserDrawer = () => {
  return (
    <NavigationContainer>
      <Navigator
        initialRouteName="Map"
        drawerContent={(props: DrawerContentComponentProps) => (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
        )}
        screenOptions={{
          headerShown: false,
          drawerType: "slide",
          drawerStyle: {
            backgroundColor: "white",
            width: 240,
          },
        }}
      >
        <Screen name="Map" component={Map} />
        <Screen
          name="Profile"
          component={Profile}
          options={({ navigation }) => ({
            headerShown: true,
            headerTransparent: true,
            headerTitle: "",
            headerLeft: () => (
              <HeaderBackButton
                onPress={() => navigation.navigate("Map")}
                labelVisible={false}
                testID="profile-back-button"
              />
            ),
          })}
        />
        <Screen
          name="Settings"
          component={Settings}
          options={({ navigation }) => ({
            headerShown: true,
            headerTransparent: true,
            headerTitle: "",
            headerLeft: () => (
              <HeaderBackButton
                onPress={() => navigation.navigate("Map")}
                labelVisible={false}
                testID="settings-back-button"
              />
            ),
          })}
        />
      </Navigator>
    </NavigationContainer>
  );
};
