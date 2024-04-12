import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import MapOverview from './MapOverview';
import OrderMenu from './OrderMenu';

import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import { useFonts } from "expo-font";
import KaiseiRegular from "../../assets/fonts/KaiseiDecol-Regular.ttf";


const Drawer = createDrawerNavigator();

export default function App() {
    return (
        <NavigationContainer>
        <Drawer.Navigator initialRouteName="Order Menu">
            <Drawer.Screen name="Home" component={MapOverview} />
            <Drawer.Screen name="Order Menu" component={OrderMenu} />
        </Drawer.Navigator>
        </NavigationContainer>
    );
}