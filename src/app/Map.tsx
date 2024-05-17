import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import LocationMarker from "../components/LocationMarker";
import { Button } from "../ui/Button";

const MapOverview = ({ navigation }: any) => {
  type MapViewRef = {
    animateToRegion: (marker: LocationType, duration?: number) => void;
  };

  const mapRef = useRef<MapView | null>(null);
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 37.789,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const { t } = useTranslation();

  type LocationType = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };

  const [marker, setMarker] = useState<LocationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoCenter, setAutoCenter] = useState(true);

  function animateToRegion(marker: LocationType, duration: number) {
    mapRef.current?.animateToRegion(marker, 500);
  }

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

  useEffect(() => {
    if (autoCenter && marker) {
      animateToRegion(marker, 500);
    }
  }, [autoCenter, marker]);

  const checkPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("map.permission-denied"));
      return false;
    }
    return true;
  };

  let locationWatcher: any = null;

  const watchLocation = async () => {
    setLoading(true);
    locationWatcher = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 1,
      },
      (location) => {
        const newLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setMarker(newLocation);
        setLoading(false);
      }
    );
  };

  const toggleAutoCenter = () => {
    if (marker && mapRef.current) {
      animateToRegion(marker, 1500);
    }
    setTimeout(() => {
      setAutoCenter(true);
    }, 500);
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <MapView
        onPanDrag={() => {
          setAutoCenter(false);
        }}
        testID="map-view"
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={currentRegion}
        onRegionChangeComplete={setCurrentRegion}
      >
        {marker && <LocationMarker coordinate={marker} />}
      </MapView>

      {loading && (
        <View className="flex-1 justify-center items-center bg-white bg-opacity-70">
          <Text>Loading your location...</Text>
        </View>
      )}

      <Button
        testID="my-location-button"
        className="absolute top-[60px] right-[30px] w-16 h-16"
        onPress={toggleAutoCenter}
        style="secondary"
      >
        <Icon name="my-location" size={24} color="#000" />
      </Button>

      <Button
        testID="user-drawer-button"
        className="absolute top-[60px] left-[30px] w-16 h-16"
        onPress={() => {
          navigation.toggleDrawer({
            latitude: currentRegion.latitude,
            longitude: currentRegion.longitude,
          });
        }}
        style="secondary"
      >
        <Icon name="menu" size={24} color="#000" />
      </Button>

      <Button
        testID="order-button"
        className="absolute bottom-[40px] right-[30px] w-[100px] h-16"
        onPress={() => {
          navigation.navigate("OrderMenu", {
            latitude: currentRegion.latitude,
            longitude: currentRegion.longitude,
          });
        }}
        text={t("map.order-button")}
        style="primary"
      />
    </View>
  );
};

export default MapOverview;
