import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import LocationMarker from "../components/LocationMarker";
import { Order, OrderStatus } from "../types/Order";
import FirestoreManager from "../services/FirestoreManager";
import { Button } from "../ui/Button";

type LocationType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const OperatorMap = ({ navigation }: any) => {
  const mapRef = useRef<MapView | null>(null);
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 37.789,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const { t } = useTranslation();

  const [marker, setMarker] = useState<LocationType | null>(null);
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

  useEffect(() => {
    if (autoCenter && marker) {
      mapRef.current?.animateToRegion(marker, 500);
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
    if (marker) {
      mapRef.current?.animateToRegion(marker, 1500);
    }
    setTimeout(() => {
      setAutoCenter(true);
    }, 500);
  };

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      const firestoreManager = new FirestoreManager();
      const pendingOrders = await firestoreManager.queryOrder(
        "status",
        OrderStatus.Pending
      );
      const acceptedOrders = await firestoreManager.queryOrder(
        "status",
        OrderStatus.Accepted
      );
      if (pendingOrders && acceptedOrders) {
        setOrders([...pendingOrders, ...acceptedOrders]);
      }
    }

    fetchOrders();
  }, []);

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
        {orders.map((order) => (
          <Marker
            coordinate={{
              latitude: order.getUsrLocation().latitude,
              longitude: order.getUsrLocation().longitude,
            }}
            key={order.getId()}
            title={t(order.getItem().getName() as "items.first-aid")}
            description={order.getOrderDate().toLocaleString()}
            pinColor={
              order.getStatus() === OrderStatus.Pending ? "yellow" : "green"
            }
          />
        ))}
      </MapView>

      {loading && (
        <View className="flex items-center justify-center bg-white/50 w-full h-full">
          <Text>Loading your location...</Text>
        </View>
      )}

      <Button
        testID="my-location-button"
        onPress={toggleAutoCenter}
        style="secondary"
        className="absolute top-[60px] right-[30px] w-16 h-16"
      >
        <Icon name="my-location" size={24} color="#fff" />
      </Button>

      <Button
        testID="order-button"
        onPress={() => {
          navigation.navigate("OrderMenu", {
            latitude: currentRegion.latitude,
            longitude: currentRegion.longitude,
          });
        }}
        style="primary"
        text={t("map.pending-orders-button")}
        className="absolute bottom-12 right-12 w-48 h-16"
      />
    </View>
  );
};

export default OperatorMap;
