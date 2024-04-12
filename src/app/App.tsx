import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import OrderMenu from "./OrderMenu";
import { useFonts } from "expo-font";
import KaiseiRegular from "../../assets/fonts/KaiseiDecol-Regular.ttf";
import MapOverview from "./MapOverview";
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Kaisei-Regular": KaiseiRegular,
  });

  return (
    <NavigationContainer>
    <Drawer.Navigator initialRouteName="Order Menu">
        <Drawer.Screen name="Order Menu" component={OrderMenu} />
        <Drawer.Screen name="Home" component={MapOverview} />
    </Drawer.Navigator>
    </NavigationContainer>
);
}
