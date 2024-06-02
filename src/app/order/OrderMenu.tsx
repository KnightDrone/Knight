import React, { useEffect, useState } from "react";
import OrderButton from "../../components/buttons/OrderButton";
import { Text, View, Alert } from "react-native";
import TriangleBackground from "../../components/TriangleBackground";
import { productButtons, ProductButton } from "../../types/ProductButtons";
import ItemCard from "../../components/cards/ItemCard";
import { useTranslation } from "react-i18next";
import { TranslationKeys } from "../../types/translation-keys";
import FirestoreManager from "../../services/FirestoreManager";
import { Order, OrderLocation } from "../../types/Order";
import { auth } from "../../services/Firebase";
import { notifyNewOrderPlaced } from "../../utils/NotificationHandler";
import useLocation from "../maps/hooks/useLocation";

export default function OrderMenu({ navigation }: { navigation: any }) {
  // Use the useLocation hook to get location data
  const {
    marker: location, // Assuming the marker represents the operator's location
    loading: locationLoading,
  } = useLocation();
  const [usrLocation, setUsrLocation] = useState<OrderLocation | null>(null);
  const getUsrLocation = (): OrderLocation => {
    if (!location) {
      Alert.alert("Location not found", "Please enable location services.");
      return {
        latitude: -999,
        longitude: -999,
      };
    } else {
      return {
        latitude: location.latitude,
        longitude: location.longitude,
      };
    }
  };
  useEffect(() => {
    if (!locationLoading) {
      setUsrLocation(getUsrLocation());
    }
  }, [locationLoading]);

  const firestoreManager = new FirestoreManager();

  const { t } = useTranslation();

  const [visibleItemId, setVisibleItemId] = useState<number | null>(null);

  const handleOpenCard = (itemId: number) => {
    setVisibleItemId(itemId);
  };

  const handleCloseCard = () => {
    setVisibleItemId(null);
  };

  // sends order to firestore and then navigates to OrderPlaced
  const handleOrderCard = async (button: ProductButton) => {
    const item = button.item;
    const user = auth.currentUser;

    if (user != null && usrLocation) {
      try {
        console.log("User is placing order ", user.uid);
        const order = new Order(user.uid, item, usrLocation);
        await order.locSearch(); // This is to call the Nominatim API to define the user location name
        console.log("Order placed: ", order);
        firestoreManager.writeData("orders", order);
        await notifyNewOrderPlaced();
        setVisibleItemId(null); // added this so that when coming back to this screen through any navigation the card is closed
        navigation.navigate("OrderPlaced", { orderId: order.getId() });
      } catch (error) {
        Alert.alert("Failed to place order, please try again later ;(");
        console.error("Failed to place order: ", error);
      }
    } else {
      Alert.alert("Failed to place order, please try again later ;(");
      console.error("Could not find user.");
    }
  };

  return (
    <View
      className="flex-1 w-full h-full flex flex-col items-center pt-40"
      testID="order-menu-screen"
    >
      <TriangleBackground color="#A0D1E4" bottom={-100} />
      <Text
        className="text-4xl mb-8 leading-10 self-center"
        testID="order-menu-text"
      >
        {t("order-menu.choose-item")}
      </Text>
      {productButtons.map((button) => (
        <OrderButton
          title={t(button.item.getName() as TranslationKeys)}
          icon={button.item.getIcon()}
          onPress={() => handleOpenCard(button.item.getId())}
          key={button.item.getId()}
        />
      ))}
      {productButtons.map((button) => {
        const isVisible = button.item.getId() === visibleItemId;
        return (
          <ItemCard
            isVisible={isVisible}
            handleClose={handleCloseCard}
            handleOrder={() => handleOrderCard(button)}
            item={button.item}
            key={`card-${button.item.getId()}`}
          />
        );
      })}
    </View>
  );
}
