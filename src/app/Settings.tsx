import React from "react";
import { StyleSheet, View, Text, Button, Alert } from "react-native";

const Settings = ({ navigation }: any) => {
  const handlePress = () => {
    navigation.navigate("Map");
  };

  return (
    <View style={styles.container} testID="settings-screen">
      <Text style={styles.text}>This is the Settings page </Text>
      <Button title="Click Me" onPress={handlePress} />
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
