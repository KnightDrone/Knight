import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { HeaderBackButton } from "@react-navigation/elements";
import Icon from "react-native-vector-icons/Ionicons";

//Add pages to add to the drawer
import Map from "./../app/Map";
import Profile from "./../app/Profile";
import Settings from "./../app/Settings";

const Drawer = createDrawerNavigator();

export const UserDrawer = () => {
  return (
    <Drawer.Navigator
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
      <Drawer.Screen name="Map" component={Map} />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={({ navigation }) => ({
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => navigation.navigate("Map")}
              backImage={() => (
                <Icon name="arrow-back" size={24} color="black" />
              )}
              labelVisible={false}
              testID="back-button"
            />
          ),
        })}
      />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
};
