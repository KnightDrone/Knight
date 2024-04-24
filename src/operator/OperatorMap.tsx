import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/MaterialIcons";

const OperatorMap = ({ navigation }: any) => {
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
    <View className="absolute inset-0" testID="map-overview-screen">
      <MapView
        testID="map-view"
        className="absolute inset-0"
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
        className="absolute bg-white items-center justify-center rounded-full p-4 top-15 right-7"
        onPress={getCurrentLocation}
      >
        <Icon name="my-location" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};
export default OperatorMap;
