import React from "react";
import { StyleSheet, View } from "react-native";

export const TriangleBackground = ({ color = "#93D39D" }) => {
  const style = StyleSheet.create({
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
      borderBottomColor: color, // Dynamic color
      opacity: 0.35,
      borderLeftColor: "transparent",
      position: "absolute",
      bottom: -123,
      left: -123,
    },
  });

  return <View style={style.triangle}></View>;
};

export default TriangleBackground;
