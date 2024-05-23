import React from "react";
import useLocation from "./hooks/useLocation";
import SharedMap from "../../components/SharedMap";
import { Button } from "../../ui/Button";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const MapOverview: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();
  const {
    mapRef,
    currentRegion,
    setCurrentRegion,
    marker,
    loading,
    autoCenter,
    setAutoCenter,
    toggleAutoCenter,
  } = useLocation();
  return (
    <SharedMap
      mapRef={mapRef}
      currentRegion={currentRegion}
      setCurrentRegion={setCurrentRegion}
      marker={marker}
      loading={loading}
      onPanDrag={() => setAutoCenter(false)}
      toggleAutoCenter={toggleAutoCenter}
      navigation={navigation}
      testid="map-view"
      mapType="user"
      bottomLeftButtonText={t("map.order-button")}
    ></SharedMap>
  );
};

export default MapOverview;
