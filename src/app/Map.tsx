// import React, { useState, useEffect, useRef } from "react";
// import { StyleSheet, View, TouchableOpacity, Text, Alert } from "react-native";
// import MapView, { MapViewProps, Region } from "react-native-maps";
// import * as Location from "expo-location";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { useTranslation } from "react-i18next";
// import LocationMarker from "../components/LocationMarker";

// const topButtonPadding = 60;
// const sideButtonPadding = 30;

// const MapOverview = ({ navigation }: any) => {
//   type MapViewRef = {
//     animateToRegion: (marker: LocationType, duration?: number) => void;
//   };

//   const mapRef = useRef<MapView | null>(null);
//   const [currentRegion, setCurrentRegion] = useState({
//     latitude: 37.789,
//     longitude: -122.4324,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   });

//   const { t } = useTranslation();

//   type LocationType = {
//     latitude: number;
//     longitude: number;
//     latitudeDelta: number;
//     longitudeDelta: number;
//   };

//   const [marker, setMarker] = useState<LocationType | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [autoCenter, setAutoCenter] = useState(true);

//   function animateToRegion(marker: LocationType, duration: number) {
//     mapRef.current?.animateToRegion(marker, 500);
//   }

//   useEffect(() => {
//     const initMap = async () => {
//       const allowed = await checkPermissions();
//       if (allowed) {
//         watchLocation();
//       }
//     };
//     initMap();

//     return () => {
//       locationWatcher?.remove();
//     };
//   }, []);

//   useEffect(() => {
//     if (autoCenter && marker) {
//       animateToRegion(marker, 500);
//     }
//   }, [autoCenter, marker]);

//   const checkPermissions = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert(t("map.permission-denied"));
//       return false;
//     }
//     return true;
//   };

//   let locationWatcher: any = null;

//   const watchLocation = async () => {
//     setLoading(true);
//     locationWatcher = await Location.watchPositionAsync(
//       {
//         accuracy: Location.Accuracy.BestForNavigation,
//         distanceInterval: 1,
//       },
//       (location) => {
//         const newLocation = {
//           latitude: location.coords.latitude,
//           longitude: location.coords.longitude,
//           latitudeDelta: 0.005,
//           longitudeDelta: 0.005,
//         };
//         setMarker(newLocation);
//         setLoading(false);
//       }
//     );
//   };

//   const toggleAutoCenter = () => {
//     if (marker && mapRef.current) {
//       animateToRegion(marker, 1500);
//     }
//     setTimeout(() => {
//       setAutoCenter(true);
//     }, 500);
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         onPanDrag={() => {
//           setAutoCenter(false);
//         }}
//         testID="map-view"
//         ref={mapRef}
//         style={styles.map}
//         initialRegion={currentRegion}
//         onRegionChangeComplete={setCurrentRegion}
//       >
//         {marker && <LocationMarker coordinate={marker} />}
//       </MapView>

//       {loading && (
//         <View style={styles.loadingContainer}>
//           <Text>Loading your location...</Text>
//         </View>
//       )}

//       <TouchableOpacity
//         testID="my-location-button"
//         style={[styles.button, styles.buttonTopRight]}
//         onPress={toggleAutoCenter}
//       >
//         <Icon name="my-location" size={24} color="#000" />
//       </TouchableOpacity>

//       <TouchableOpacity
//         testID="user-drawer-button"
//         style={[styles.button, styles.buttonTopLeft]}
//         onPress={() => {
//           navigation.toggleDrawer({
//             latitude: currentRegion.latitude,
//             longitude: currentRegion.longitude,
//           });
//         }}
//       >
//         <Icon name="menu" size={24} color="#000" />
//       </TouchableOpacity>

//       <TouchableOpacity
//         testID="order-button"
//         style={[styles.button, styles.buttonBottomRight]}
//         onPress={() => {
//           navigation.navigate("OrderMenu", {
//             latitude: currentRegion.latitude,
//             longitude: currentRegion.longitude,
//           });
//         }}
//       >
//         <Text style={styles.buttonText}>{t("map.order-button")}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   button: {
//     position: "absolute",
//     backgroundColor: "rgba(255,255,255, 1)",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 20,
//     padding: 15,
//   },
//   buttonTopRight: {
//     top: topButtonPadding,
//     right: sideButtonPadding,
//   },
//   buttonBottomRight: {
//     bottom: 40,
//     right: sideButtonPadding,
//   },

//   buttonTopLeft: {
//     top: topButtonPadding,
//     left: sideButtonPadding,
//   },
//   buttonText: {
//     fontSize: 20,
//     color: "#000",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(255,255,255, 0.7)",
//   },
// });

// export default MapOverview;

import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Alert } from "react-native";
import MapView, { Region } from "react-native-maps";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import LocationMarker from "../components/LocationMarker";
import { Button } from "../ui/Button";

const topButtonPadding = 60;
const sideButtonPadding = 30;

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
        //className="absolute inset-0"
        initialRegion={currentRegion}
        onRegionChangeComplete={setCurrentRegion}
      >
        {marker && <LocationMarker coordinate={marker} />}
      </MapView>

      {loading && (
        <View className="flex-1 justify-center items-center bg-white/70">
          <Text>Loading your location...</Text>
        </View>
      )}

      <Button
        testID="my-location-button"
        onPress={toggleAutoCenter}
        style="primary"
        className="absolute top-12 right-12 w-16 h-16"
      >
        <Icon name="my-location" size={24} color="#fff" />
      </Button>

      <Button
        testID="user-drawer-button"
        className="absolute top-16 left-8 bg-white p-4 rounded-lg flex items-center justify-center"
        style="primary"
        onPress={() => {
          navigation.toggleDrawer({
            latitude: currentRegion.latitude,
            longitude: currentRegion.longitude,
          });
        }}
      >
        <Icon name="menu" size={24} color="#000" />
      </Button>

      <TouchableOpacity
        testID="order-button"
        className="absolute bottom-10 right-8 bg-white p-4 rounded-lg flex items-center justify-center"
        onPress={() => {
          navigation.navigate("OrderMenu", {
            latitude: currentRegion.latitude,
            longitude: currentRegion.longitude,
          });
        }}
      >
        <Text className="text-lg text-black">{t("map.order-button")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MapOverview;
