// Map.tsx
import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/MaterialIcons";

const topButtonPadding = 60;
const sideButtonPadding = 30;

// Use the navigation prop to navigate to another screen
const Map = ({ navigation }: any) => {
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 37.789,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [marker, setMarker] = useState({
    latitude: 37.789,
    longitude: -122.4324,
  });

  const [locationPermission, setLocationPermission] = useState(false);

  const checkPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocationPermission(false);
      Alert.alert("Permission to access location was denied");
      return false;
    }
    setLocationPermission(true);

    return true;
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  const getCurrentLocation = async () => {
    const allowed = await checkPermissions();
    if (allowed) {
      let location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setCurrentRegion(newRegion);
      setMarker({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } else {
      Alert.alert("Location permission not granted");
    }
  };

  return (
    <View style={styles.container} testID="map-overview-screen">
      <MapView
        testID="map-view"
        style={styles.map}
        region={currentRegion}
        onRegionChangeComplete={(region) => setCurrentRegion(region)}
      >
        <Marker
          testID="map-marker"
          coordinate={marker}
          title="Current Location"
        />
      </MapView>

      <TouchableOpacity
        testID="get-location-button"
        style={[styles.button, styles.buttonTopRight]}
        onPress={getCurrentLocation}
      >
        {/* top right button */}
        <Icon name="my-location" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        testID="order-button"
        style={[styles.button, styles.buttonBottomRight]}
        onPress={() => navigation.navigate("OrderMenu")}
      >
        <Text style={styles.buttonText}>Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255, 1)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 15,
  },
  buttonTopLeft: {
    top: topButtonPadding,
    left: sideButtonPadding,
  },
  buttonTopRight: {
    top: topButtonPadding,
    right: sideButtonPadding,
  },
  buttonBottomRight: {
    bottom: 40,
    right: sideButtonPadding,
  },
  buttonText: {
    fontSize: 20,
    color: "#000",
  },
});

export default Map;
