import React, { ReactNode } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Region } from "react-native-maps";
import LocationMarker from "./LocationMarker";
import { Button } from "../ui/Button";
import Icon from "react-native-vector-icons/MaterialIcons";

type SharedMapProps = {
  mapRef: React.RefObject<MapView>;
  currentRegion: Region;
  setCurrentRegion: (region: Region) => void;
  marker: Region | null;
  loading: boolean;
  onPanDrag: () => void;
  toggleAutoCenter: () => void;
  navigation?: any;
  children?: ReactNode;
};

const SharedMap: React.FC<SharedMapProps> = ({
  mapRef,
  currentRegion,
  setCurrentRegion,
  marker,
  loading,
  onPanDrag,
  toggleAutoCenter,
  navigation,
  children,
}) => {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <MapView
        onPanDrag={onPanDrag}
        testID="map-view"
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={currentRegion}
        onRegionChangeComplete={(region: Region) => setCurrentRegion(region)}
      >
        {marker && <LocationMarker coordinate={marker} />}
        {children}
      </MapView>

      {loading && (
        <View style={styles.loadingContainer}>
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

      {navigation && (
        <>
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
            text="Order"
            style="primary"
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
});

export default SharedMap;
