// hooks/useLocation.tsx
import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";
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
      }
    );
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
