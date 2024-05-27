// import { useState, useEffect, useRef } from "react";
// import * as Location from "expo-location";
// import { Alert } from "react-native";
// import { useTranslation } from "react-i18next";
// import MapView from "react-native-maps";

// type LocationType = {
//   latitude: number;
//   longitude: number;
//   latitudeDelta: number;
//   longitudeDelta: number;
// };

// type UseLocationReturnType = {
//   mapRef: React.RefObject<MapView>;
//   currentRegion: LocationType;
//   setCurrentRegion: React.Dispatch<React.SetStateAction<LocationType>>;
//   marker: LocationType | null;
//   loading: boolean;
//   autoCenter: boolean;
//   setAutoCenter: React.Dispatch<React.SetStateAction<boolean>>;
//   animateToRegion: (marker: LocationType, duration?: number) => void;
//   toggleAutoCenter: () => void;
// };

// const useLocation = (): UseLocationReturnType => {
//   const { t } = useTranslation();
//   const mapRef = useRef<MapView | null>(null);
//   const [currentRegion, setCurrentRegion] = useState<LocationType>({
//     latitude: 37.789,
//     longitude: -122.4324,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   });
//   const [marker, setMarker] = useState<LocationType | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [autoCenter, setAutoCenter] = useState(true);
//   let locationWatcher = useRef<Location.LocationSubscription | null>(
//     null
//   ).current;

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
//       mapRef.current?.animateToRegion(marker, 500);
//     }
//   }, [autoCenter, marker]);

//   const checkPermissions = async (): Promise<boolean> => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert(t("map.permission-denied"));
//       return false;
//     }
//     return true;
//   };

//   const watchLocation = async () => {
//     setLoading(true);
//     locationWatcher = await Location.watchPositionAsync(
//       {
//         accuracy: Location.Accuracy.BestForNavigation,
//         distanceInterval: 1,
//       },
//       (location) => {
//         const newLocation: LocationType = {
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

//   const animateToRegion = (marker: LocationType, duration: number = 500) => {
//     mapRef.current?.animateToRegion(marker, duration);
//   };

//   const toggleAutoCenter = () => {
//     if (marker) {
//       animateToRegion(marker, 1500);
//     }
//     setTimeout(() => {
//       setAutoCenter(true);
//     }, 500);
//   };

//   return {
//     mapRef,
//     currentRegion,
//     setCurrentRegion,
//     marker,
//     loading,
//     autoCenter,
//     setAutoCenter,
//     animateToRegion,
//     toggleAutoCenter,
//   };
// };

// export default useLocation;

import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import MapView from "react-native-maps";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LocationType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type UseLocationReturnType = {
  mapRef: React.RefObject<MapView>;
  currentRegion: LocationType;
  setCurrentRegion: React.Dispatch<React.SetStateAction<LocationType>>;
  marker: LocationType | null;
  loading: boolean;
  autoCenter: boolean;
  setAutoCenter: React.Dispatch<React.SetStateAction<boolean>>;
  animateToRegion: (marker: LocationType, duration?: number) => void;
  toggleAutoCenter: () => void;
};

const useLocation = (): UseLocationReturnType => {
  const { t } = useTranslation();
  const mapRef = useRef<MapView | null>(null);
  const [currentRegion, setCurrentRegion] = useState<LocationType>({
    latitude: 37.789,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [marker, setMarker] = useState<LocationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoCenter, setAutoCenter] = useState(true);
  let locationWatcher = useRef<Location.LocationSubscription | null>(
    null
  ).current;

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

  const checkPermissions = async (): Promise<boolean> => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("map.permission-denied"));
      return false;
    }
    return true;
  };

  const watchLocation = async () => {
    setLoading(true);
    locationWatcher = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 1,
      },
      (location) => {
        const newLocation: LocationType = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setMarker(newLocation);
        setLoading(false);
        downloadTiles(newLocation);
      }
    );
  };

  const downloadTiles = async (location: LocationType) => {
    const zoomLevels = [16];
    const radius = 10;
    const tileSize = 256;
    const positionThreshold = 500;

    const offlineTilesDir = `${FileSystem.documentDirectory}offline-tiles/`;

    try {
      await FileSystem.makeDirectoryAsync(offlineTilesDir, {
        intermediates: true,
      });
    } catch (error) {
      console.error("Error creating offline-tiles directory:", error);
      return;
    }

    const currentPositionKey = `${location.latitude},${location.longitude}`;
    const lastPositionKey = await AsyncStorage.getItem("lastPositionKey");

    if (lastPositionKey === currentPositionKey) {
      return;
    }

    if (lastPositionKey) {
      const [lastLatitude, lastLongitude] = lastPositionKey
        .split(",")
        .map(parseFloat);
      const distance = haversineDistance(
        location.latitude,
        location.longitude,
        lastLatitude,
        lastLongitude
      );

      if (distance < positionThreshold) {
        return;
      }
    }

    await AsyncStorage.setItem("lastPositionKey", currentPositionKey);

    for (const zoom of zoomLevels) {
      console.log(`Downloading tiles for zoom level ${zoom}`);
      const scale = Math.pow(2, zoom);
      const centerX = Math.floor(((location.longitude + 180) / 360) * scale);
      const centerY = Math.floor(
        ((1 -
          Math.log(
            Math.tan((location.latitude * Math.PI) / 180) +
              1 / Math.cos((location.latitude * Math.PI) / 180)
          ) /
            Math.PI) /
          2) *
          scale
      );

      const tileRange = Math.ceil(
        radius /
          ((tileSize *
            156543.03392 *
            Math.cos((location.latitude * Math.PI) / 180)) /
            (scale * tileSize))
      );

      for (let x = centerX - tileRange; x <= centerX + tileRange; x++) {
        for (let y = centerY - tileRange; y <= centerY + tileRange; y++) {
          const url = `https://a.tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
          const fileName = `${FileSystem.documentDirectory}offline-tiles/${zoom}-${x}-${y}.png`;

          try {
            const { exists } = await FileSystem.getInfoAsync(fileName);
            if (!exists) {
              const downloadResult = await FileSystem.downloadAsync(
                url,
                fileName
              );
              if (downloadResult.status !== 200) {
                console.error("Error downloading tile:", url);
              }
            }
          } catch (error) {
            console.error("Error downloading tile:", url, error);
          }
        }
      }
    }
  };

  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3;
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const animateToRegion = (marker: LocationType, duration: number = 500) => {
    mapRef.current?.animateToRegion(marker, duration);
  };

  const toggleAutoCenter = () => {
    if (marker) {
      animateToRegion(marker, 1500);
    }
    setTimeout(() => {
      setAutoCenter(true);
    }, 500);
  };

  return {
    mapRef,
    currentRegion,
    setCurrentRegion,
    marker,
    loading,
    autoCenter,
    setAutoCenter,
    animateToRegion,
    toggleAutoCenter,
  };
};

export default useLocation;
