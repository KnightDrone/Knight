import React, { useEffect, useState } from "react";
import useLocation from "./hooks/useLocation";
import SharedMap from "../../components/SharedMap";
import { Marker } from "react-native-maps";
import FirestoreManager from "../../services/FirestoreManager";
import { Order, OrderStatus } from "../../types/Order";
import { useTranslation } from "react-i18next";

const OperatorMap: React.FC<{ navigation: any }> = ({ navigation }) => {
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

  const [orders, setOrders] = useState<Order[]>([]);
  const { t } = useTranslation();

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
    </SharedMap>
  );
};

export default OperatorMap;
