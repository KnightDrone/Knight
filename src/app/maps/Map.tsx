import React from "react";
import useLocation from "./hooks/useLocation";
import SharedMap from "../../components/SharedMap";
import { Button } from "../../ui/Button";
import { useTranslation } from "react-i18next";

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
    >
      <Button
        testID="order-button"
        text={t("map.order-button")}
        className="absolute bottom-[40px] right-[30px] w-[100px] h-16"
        onPress={() => {
          navigation.navigate("OrderMenu", {
            latitude: currentRegion.latitude,
            longitude: currentRegion.longitude,
          });
        }}
        style="primary"
      />
    </SharedMap>
  );
};

export default MapOverview;
