// import { createStackNavigator } from "@react-navigation/stack";
// import LocationPicker from "./LocationPicker";
// import OfflineMapScreen from "./OfflineMap";
// import { View, StyleSheet } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import OfflineMapSettings from "./OfflineMapSettings";
// import { useState } from "react";

// //creat OfflineStackParamList

// export type OfflineStackParamList = {
//   OfflineMapSettings: undefined;
//   LocationPicker: undefined;
//   OfflineMap: { name: string };
// };

// const { Navigator, Screen } = createStackNavigator<OfflineStackParamList>();

// const Stack = createStackNavigator<OfflineStackParamList>();

// export const OfflineMapStack = () => {
//   return (
//     <View style={styles.container}>
//       <Stack.Navigator initialRouteName="OfflineMapSettings">
//         <Stack.Screen
//           name="OfflineMapSettings"
//           component={OfflineMapSettings}
//           options={{
//             header: () => null,
//           }}
//         />
//         <Stack.Screen
//           name="LocationPicker"
//           component={LocationPicker}
//           options={{
//             header: () => null,
//           }}
//         />
//         <Stack.Screen
//           name="OfflineMap"
//           component={OfflineMapScreen}
//           options={{
//             header: () => null,
//           }}
//         />
//       </Stack.Navigator>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 20,
//   },
// });

import { createStackNavigator } from "@react-navigation/stack";
import LocationPicker from "./LocationPicker";
import { View, StyleSheet, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OfflineMapSettings from "./OfflineMapSettings";
import { OfflineMap } from "./OfflineMap";

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
            header: () => null,
          }}
        />
        <Stack.Screen
          name="LocationPicker"
          component={LocationPicker}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="OfflineMap"
          component={OfflineMap}
          options={({ navigation }) => ({
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
