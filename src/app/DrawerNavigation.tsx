import React from "react";
import { HeaderBackButton } from "@react-navigation/elements";
import Icon from "react-native-vector-icons/MaterialIcons";

import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

import MapOverview from "./Map";
import OrderMenu from "./OrderMenu";
import OrderPlaced from "./OrderPlaced";

const Drawer = createDrawerNavigator<DrawerParamList>();

export type DrawerParamList = {
  OrderMenu: undefined;
  Map: undefined;
};

function ProfileContainer(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Profile" onPress={() => {}} />
    </DrawerContentScrollView>
  );
}

const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props: DrawerContentComponentProps) => (
        <ProfileContainer {...props} />
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
      <Drawer.Screen name="Map" component={MapOverview} />
      <Drawer.Screen
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
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
