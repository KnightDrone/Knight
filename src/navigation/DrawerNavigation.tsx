import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { HeaderBackButton } from "@react-navigation/elements";
import Icon from "react-native-vector-icons/Ionicons";

//Add pages to add to the drawer
import MapOverview from "./../app/MapOverview";
import Profile from "./../app/Profile";
import Settings from "./../app/Settings";

const { Screen, Navigator } = createDrawerNavigator();

export const UserDrawer = () => {
  return (
    <Navigator initialRouteName="MapOverview">
      <Screen name="MapOverview" component={MapOverview} />
      <Screen
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
      <Screen
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
    </Navigator>
  );
};
