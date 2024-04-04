import React from "react";
import OrderButton from "../components/OrderButton";
import { Text, StyleSheet, View } from "react-native";
import { useFonts } from "expo-font";
import KaiseiRegular from "../../assets/fonts/KaiseiDecol-Regular.ttf";

interface OrderProps {
  // Define your component props here
}

interface Product {
  id: number;
  title: string;
  image: string;
}

interface ProductButton {
  product: Product;
  onPress: () => void;
}

const images: { [key: string]: any } = {
  first_aid: require("../../assets/images/first_aid.png"),
  flashlight: require("../../assets/images/flashlight.png"),
  thermal_blanket: require("../../assets/images/thermal_blanket.png"),
  powerbank: require("../../assets/images/powerbank.png"),
};

const productButtons: ProductButton[] = [
  {
    product: { id: 1, title: "First Aid Kit", image: "first_aid" },
    onPress: () => console.log("First Aid Kit"),
  },
  {
    product: { id: 2, title: "Flashlight", image: "flashlight" },
    onPress: () => console.log("Flashlight"),
  },
  {
    product: { id: 3, title: "Thermal Blanket", image: "thermal_blanket" },
    onPress: () => console.log("Thermal Blanket"),
  },
  {
    product: { id: 4, title: "Power Bank", image: "powerbank" },
    onPress: () => console.log("Power Bank"),
  },
];

export default function OrderMenu() {
  const [fontsLoaded] = useFonts({
    "Kaisei-Regular": KaiseiRegular,
  });

  return (
    <View style={styles.container}>
      <View style={styles.triangle}></View>
      <Text style={styles.text}>Choose your item</Text>
      {productButtons.map((button) => (
        <OrderButton
          title={button.product.title}
          image={images[button.product.image]}
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
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 0,
    borderRightWidth: 460, // Width of the triangle
    borderBottomWidth: 750, // Height of the triangle
    borderLeftWidth: 0, // Width of the triangle
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#93D39D", // Color of the triangle
    borderLeftColor: "transparent",
    position: "absolute", // This ensures the triangle is in the background
    bottom: -123,
    left: -23,
  },
  text: {
    fontSize: 36,
    marginBottom: 33,
    fontFamily: "Kaisei-Regular",
    lineHeight: 40,
    alignSelf: "center",
  },
});
