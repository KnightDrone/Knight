import React from "react";
import { View } from "react-native";

const TriangleBackground = ({ color = "#93D39D", bottom = -350 }) => {
  return (
    <View
      className="w-0 h-0 bg-transparent border-solid border-t-0 border-r-[460px] border-b-[750px] border-l-0 border-t-transparent border-r-transparent opacity-35 border-l-transparent absolute"
      style={{ borderBottomColor: color, bottom: bottom, left: -23 }}
    ></View>
  );
};

export default TriangleBackground;
