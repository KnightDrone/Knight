import React from "react";
import { StyleSheet, View } from "react-native";

export default function TriangleBackground() {
  return <View style={styles.triangle}></View>;
}

const styles = StyleSheet.create({
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
    opacity: 0.35,
    borderLeftColor: "transparent",
    position: "absolute", // This ensures the triangle is in the background
    bottom: -123,
    left: -23,
  },
});
