import React, { useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import MapView, { Region } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { downloadTiles } from "./DownloadTiles";
import { waitFor } from "@testing-library/react-native";

const LocationPicker: React.FC = () => {
  const [name, setName] = useState<string>("");

  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const handleRegionChangeComplete = (region: Region) => {
    setRegion(region);
  };

  const givename = () => {
    return new Promise((resolve) => {
      Alert.prompt("Enter name", "Enter a name for this location", (name) => {
        setName(name);
        resolve(name);
      });
    });
  };

  const handleSaveLocation = async () => {
    const name = await givename();
    downloadTiles(region, `${name}`);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChangeComplete}
      />
      <View style={styles.markerFixed}>
        <Ionicons name="location" size={48} color="black" />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Save Location" onPress={handleSaveLocation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerFixed: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -24,
    marginTop: -48,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 10,
  },
});

export default LocationPicker;
