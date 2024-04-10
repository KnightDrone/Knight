import React from "react";
import OrderButton from "../components/OrderButton";
import { Text, StyleSheet, View } from "react-native";
import { useFonts } from "expo-font";
import { Item } from "../components/Item";
import KaiseiRegular from "../../assets/fonts/KaiseiDecol-Regular.ttf";
import TriangleBackground from "../components/TriangleBackground";
import { productButtons } from "../components/ProductButtons";

interface OrderProps {
  // Define your component props here
  // will pass location and maybe user info here
}

export default function OrderMenu() {
  const [fontsLoaded] = useFonts({
    "Kaisei-Regular": KaiseiRegular,
  });

  return (
    <View style={styles.container}>
      <TriangleBackground />
      <Text style={styles.text}>Choose your item</Text>
      {productButtons.map((button) => (
        <OrderButton
          title={button.item.getName()}
          icon={button.item.getIcon()} // this is incorrect
          onPress={button.onPress}
          key={button.item.getId()}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  text: {
    fontSize: 36,
    marginBottom: 33,
    fontFamily: "Kaisei-Regular",
    lineHeight: 40,
    alignSelf: "center",
  },
});
