import { createStackNavigator } from "@react-navigation/stack";
import LocationPicker from "./LocationPicker";
import { View, StyleSheet, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OfflineMapSettings from "./OfflineMapSettings";
import { OfflineMap } from "./OfflineMap";
import React from "react";

export type OfflineStackParamList = {
  OfflineMapSettings: undefined;
  LocationPicker: undefined;
  OfflineMap: { name: string };
};

const Stack = createStackNavigator<OfflineStackParamList>();

export const OfflineMapStack = () => {
  return (
    <View style={styles.container}>
      <Stack.Navigator initialRouteName="OfflineMapSettings">
        <Stack.Screen
          name="OfflineMapSettings"
          component={OfflineMapSettings}
          options={{
            headerTransparent: true,
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="LocationPicker"
          component={LocationPicker}
          options={({ navigation }) => ({
            header: () => null,
            // headerLeft: () => (
            //   <Button onPress={() => navigation.goBack()} title="Cancel" />
            // ),
          })}
        />
        <Stack.Screen
          name="OfflineMap"
          component={OfflineMap}
          options={({ navigation }) => ({
            header: () => null,
            headerLeft: () => (
              <Button onPress={() => navigation.goBack()} title="Back" />
            ),
          })}
        />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
});
