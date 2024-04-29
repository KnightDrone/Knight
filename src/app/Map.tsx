import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Alert } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/MaterialIcons";
import LocationMarker from "../components/LocationMarker";

const topButtonPadding = 60;
const sideButtonPadding = 30;

const MapOverview = ({ navigation }) => {
  const mapRef = useRef(null);
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 37.789,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoCenter, setAutoCenter] = useState(true);

  useEffect(() => {
    const initMap = async () => {
      const allowed = await checkPermissions();
      if (allowed) {
        watchLocation();
      }
    };
    initMap();

    return () => {
      locationWatcher?.remove();
    };
  }, []);

  const checkPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return false;
    }
    return true;
  };

  let locationWatcher = null;

  const watchLocation = async () => {
    setLoading(true);
    locationWatcher = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 1,
      },
      (location) => {
        const newLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setMarker(newLocation);
        if (autoCenter) {
          mapRef.current.animateToRegion(
            { ...newLocation, latitudeDelta: 0.005, longitudeDelta: 0.005 },
            1500
          );
        }
        setLoading(false);
      }
    );
  };

  const toggleAutoCenter = () => {
    setAutoCenter(true);
    if (marker) {
      mapRef.current.animateToRegion(
        { ...marker, latitudeDelta: 0.005, longitudeDelta: 0.005 },
        1000
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={currentRegion}
        onPanDrag={() => setAutoCenter(false)}
        onRegionChangeComplete={setCurrentRegion}
      >
        {marker && <LocationMarker coordinate={marker} />}
      </MapView>

      {loading && (
        <View style={styles.loadingContainer}>
          <Text>Loading your location...</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, styles.buttonTopRight]}
        onPress={toggleAutoCenter}
      >
        <Icon name="my-location" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255, 0.7)",
  },
});

export default MapOverview;
