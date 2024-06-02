import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import { useTranslation } from "react-i18next";
import MapView from "react-native-maps";

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

const LOCATION_FILE = `${FileSystem.documentDirectory}location.json`;
const DEFAULT_LOCATION = {
  latitude: 46.519040821641006,
  longitude: 6.568773468321669,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const useLocation = (): UseLocationReturnType => {
  const { t } = useTranslation();
  const mapRef = useRef<MapView | null>(null);
  const [currentRegion, setCurrentRegion] =
    useState<LocationType>(DEFAULT_LOCATION);
  const [marker, setMarker] = useState<LocationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoCenter, setAutoCenter] = useState(true);
  let locationWatcher = useRef<Location.LocationSubscription | null>(
    null
  ).current;

  useEffect(() => {
    const initMap = async () => {
      const savedLocation = await loadSavedLocation();
      if (savedLocation) {
        console.log("Using saved location", savedLocation);
        setCurrentRegion(savedLocation);
        setMarker(savedLocation);
      }

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

  const loadSavedLocation = async (): Promise<LocationType | null> => {
    try {
      console.log("Loading saved location from file path", LOCATION_FILE);
      const fileContents = await FileSystem.readAsStringAsync(LOCATION_FILE);
      return JSON.parse(fileContents);
    } catch (error) {
      console.log("No saved location file found, using default location.");
      return null;
    }
  };

  const saveLocation = async (location: LocationType) => {
    try {
      await FileSystem.writeAsStringAsync(
        LOCATION_FILE,
        JSON.stringify(location)
      );
    } catch (error) {
      console.error("Error saving location to file", error);
    }
  };

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
      async (location) => {
        const newLocation: LocationType = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setMarker(newLocation);
        setLoading(false);
        await saveLocation(newLocation);
        console.log("Saved location to file", newLocation);
      }
    );
  };

  const animateToRegion = (marker: LocationType, duration: number = 500) => {
    mapRef.current?.animateToRegion(marker, duration);
  };

  const toggleAutoCenter = () => {
    if (marker && !loading) {
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
