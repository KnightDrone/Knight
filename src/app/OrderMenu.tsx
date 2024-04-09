import React from "react";
import OrderButton from "../components/OrderButton";
import { Text, StyleSheet, View } from "react-native";
import { useFonts } from "expo-font";
import KaiseiRegular from "../../assets/fonts/KaiseiDecol-Regular.ttf";
import TriangleBackground from "../components/TriangleBackground";

interface OrderProps {
  // Define your component props here
}

interface Product {
  id: number;
  title: string;
  icon: string;
}

interface ProductButton {
  product: Product;
  onPress: () => void;
}

const icons: { [key: string]: any } = {
  first_aid: require("../../assets/icons/first_aid_icon.png"),
  flashlight: require("../../assets/icons/flashlight_icon.png"),
  thermal_blanket: require("../../assets/icons/blanket_icon.png"),
  powerbank: require("../../assets/icons/powerbank_icon.png"),
};

const productButtons: ProductButton[] = [
  {
    product: { id: 1, title: "First aid kit", icon: "first_aid" },
    onPress: () => console.log("First aid kit"),
  },
  {
    product: { id: 2, title: "Flashlight", icon: "flashlight" },
    onPress: () => console.log("Flashlight"),
  },
  {
    product: { id: 3, title: "Thermal blanket", icon: "thermal_blanket" },
    onPress: () => console.log("Thermal blanket"),
  },
  {
    product: { id: 4, title: "Power bank", icon: "powerbank" },
    onPress: () => console.log("Power bank"),
  },
];

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
          title={button.product.title}
          icon={icons[button.product.icon]}
          onPress={button.onPress}
          key={button.product.id}
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
