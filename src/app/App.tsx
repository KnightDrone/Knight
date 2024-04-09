import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import OrderMenu from "./OrderMenu";
import { useFonts } from "expo-font";
import KaiseiRegular from "../../assets/fonts/KaiseiDecol-Regular.ttf";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Kaisei-Regular": KaiseiRegular,
  });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <OrderMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
});
