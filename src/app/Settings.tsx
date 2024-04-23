import React from "react";
import { StyleSheet, View, Text, Button, Alert } from "react-native";

const Settings = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Settings page </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default Settings;
