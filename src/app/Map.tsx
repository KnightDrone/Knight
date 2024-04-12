// Map.tsx
import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import MapView from 'react-native-maps';
//import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/MaterialIcons';

const topButtonPadding = 60;
const sideButtonPadding = 30;

const MapOverview: React.FC<{ }> = ({  }) => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78900,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      <TouchableOpacity style={[styles.button, styles.buttonTopLeft]}>
        {/* top left button */}
        <Icon name="menu" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.buttonTopRight]}>
        {/* top right button */}
        <Icon name="my-location" size={24} color="#000" />
      </TouchableOpacity>

      {/* order button */}
      <TouchableOpacity style={[styles.button, styles.buttonBottomRight]} onPress={() => console.log('Order')
      }>
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
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255, 1)',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#000',
  },
});

export default MapOverview;

// import React, { useEffect, useState } from "react";
// import {
//   StyleSheet,
//   View,
//   TouchableOpacity,
//   Text,
//   Dimensions,
//   Image,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import * as Location from "expo-location";
// import MapView, { Marker } from "react-native-maps";

// const windowWidth = Dimensions.get("window").width;
// const windowHeight = Dimensions.get("window").height;
// // Define types for your state variables
// interface LocationCoords {
//   latitude: number;
//   longitude: number;
// }
// interface Region extends LocationCoords {
//   latitudeDelta: number;
//   longitudeDelta: number;
// }

// export default function MapScreen({ promptAsync, navigation }: any) {
//   const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(
//     null
//   );
//   const [initialRegion, setInitialRegion] = useState<Region | null>(null);
//   useEffect(() => {
//     const getLocation = async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.log("Permission to access location was denied");
//         return;
//       }
//       let location = await Location.getCurrentPositionAsync({});
//       setCurrentLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });
//       setInitialRegion({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         latitudeDelta: 0.005,
//         longitudeDelta: 0.005,
//       });
//     };
//     getLocation();
//   }, []);
//   return (
//     <View style={styles.container}>
//       {initialRegion && (
//         <MapView style={styles.map} initialRegion={initialRegion}>
//           {currentLocation && (
//             <Marker
//               coordinate={{
//                 latitude: currentLocation.latitude,
//                 longitude: currentLocation.longitude,
//               }}
//               title="Your Location"
//             />
//           )}
//         </MapView>
//       )}
//       {/* Adding a small round text box for "Orders" */}
//       <TouchableOpacity style={styles.ordersBox}>
//         <Text
//           style={styles.ordersText}
//           onPress={() => navigation.navigate("OrderMenu")}
//         >
//           Orders
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   map: {
//     width: "100%",
//     height: "100%",
//   },
//   ordersBox: {
//     position: "absolute", // Position it over the map
//     bottom: 20, // 20 pixels from the bottom
//     right: 20, // 20 pixels from the right
//     backgroundColor: "white",
//     borderRadius: 20, // Circular shape
//     paddingVertical: 10, // Vertical padding
//     paddingHorizontal: 20, // Horizontal padding
//     shadowColor: "#000", // Shadow for better visibility
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   ordersText: {
//     color: "black", // Text color
//     fontWeight: "bold", // Bold text
//   },
// });
