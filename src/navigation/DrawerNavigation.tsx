import React from "react";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { HeaderBackButton } from "@react-navigation/elements";
import Icon from "react-native-vector-icons/Ionicons";

//Add pages to add to the drawer
import MapOverview from "./../app/MapOverview";
import Profile from "./../app/Profile";
import Settings from "./../app/Settings";

const Drawer = createDrawerNavigator();

export const UserDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="MapOverview"
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
      <Drawer.Screen name="MapOverview" component={MapOverview} />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={({ navigation }) => ({
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => navigation.navigate("MapOverview")}
              backImage={() => (
                <Icon name="arrow-back" size={24} color="black" />
              )}
              labelVisible={false}
              testID="back-button"
            />
          ),
        })}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={({ navigation }) => ({
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => navigation.navigate("MapOverview")}
              backImage={() => (
                <Icon name="arrow-back" size={24} color="black" />
              )}
              labelVisible={false}
              testID="back-button"
            />
          ),
        })}
      />
    </Drawer.Navigator>
  );
};
