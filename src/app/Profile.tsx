import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

function Profile({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://via.placeholder.com/100" }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{"userName"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    marginTop: 80,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eaeaea",
  },
  name: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Profile;
