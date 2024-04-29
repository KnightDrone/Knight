// // Map.tsx
// import React, { useState, useEffect } from "react";
// import { StyleSheet, View, TouchableOpacity, Text, Alert } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import * as Location from "expo-location";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import LocationMarker from "../components/LocationMarker";

// const topButtonPadding = 60;
// const sideButtonPadding = 30;

// // Use the navigation prop to navigate to another screen
// const MapOverview = ({ navigation }: any) => {
//   const [currentRegion, setCurrentRegion] = useState({
//     latitude: 37.789,
//     longitude: -122.4324,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   });

//   const [marker, setMarker] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [locationPermission, setLocationPermission] = useState(false);

//   const checkPermissions = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== "granted") {
//       setLocationPermission(false);
//       Alert.alert("Permission to access location was denied");
//       return false;
//     }
//     setLocationPermission(true);

//     return true;
//   };

//   useEffect(() => {
//     const initMap = async () => {
//       const allowed = await checkPermissions();
//       if (allowed) {
//         await getCurrentLocation();
//       }
//     };
//     initMap();
//   }, []);

//   const getCurrentLocation = async () => {
//     const allowed = await checkPermissions();
//     if (allowed) {
//       setLoading(true);
//       let location = await Location.getCurrentPositionAsync({});
//       const newRegion = {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         latitudeDelta: 0.005,
//         longitudeDelta: 0.005,
//       };
//       setCurrentRegion(newRegion);
//       setMarker({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });
//       setLoading(false);  // Set loading to false after fetching location
//     } else {
//       Alert.alert("Location permission not granted");
//       setLoading(false);  // Ensure loading is set to false even if permission is denied
//     }
//   };

//   return (
//     <View style={styles.container} testID="map-overview-screen">
//       <MapView
//         testID="map-view"
//         style={styles.map}
//         region={currentRegion}
//         onRegionChangeComplete={(region) => setCurrentRegion(region)}
//       >
//         {marker && (
//           <LocationMarker
//           coordinate={marker}
//           />
//         )}
//       </MapView>

//       {loading && (
//         <View style={styles.loadingContainer}>
//           <Text>Loading your location...</Text>
//         </View>
//       )}

//       <TouchableOpacity
//         testID="get-location-button"
//         style={[styles.button, styles.buttonTopRight]}
//         onPress={getCurrentLocation}
//       >
//         <Icon name="my-location" size={24} color="#000" />
//       </TouchableOpacity>

//       <TouchableOpacity
//         testID="order-button"
//         style={[styles.button, styles.buttonBottomRight]}
//         onPress={() => navigation.navigate("OrderMenu")}
//       >
//         <Text style={styles.buttonText}>Order</Text>
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
//   buttonTopLeft: {
//     top: topButtonPadding,
//     left: sideButtonPadding,
//   },
//   buttonTopRight: {
//     top: topButtonPadding,
//     right: sideButtonPadding,
//   },
//   buttonBottomRight: {
//     bottom: 40,
//     right: sideButtonPadding,
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
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/MaterialIcons";
import LocationMarker from "../components/LocationMarker";

const topButtonPadding = 60;
const sideButtonPadding = 30;

const MapOverview = ({ navigation }: any) => {
  const mapRef = useRef(null);
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 37.789,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initMap = async () => {
      const allowed = await checkPermissions();
      if (allowed) {
        watchLocation();
      }
    };
    initMap();

    return () => {
      if (locationWatcher) {
        locationWatcher.remove();
      }
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

  let locationWatcher: { remove: any } | null = null;

  const watchLocation = async () => {
    setLoading(true);
    locationWatcher = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 0.1,
      },
      (location) => {
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setCurrentRegion(newRegion);
        setMarker(newRegion);
        setLoading(false);
      }
    );
  };

  const centerMapOnCurrentLocation = () => {
    if (marker) {
      const newRegion = {
        latitude: marker.latitude,
        longitude: marker.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      mapRef.current.animateToRegion(newRegion, 1000); // Animate map to new region
    } else {
      Alert.alert("Current location not available");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={currentRegion}
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
        onPress={centerMapOnCurrentLocation}
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
