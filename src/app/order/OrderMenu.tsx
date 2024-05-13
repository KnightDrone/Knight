import React, { useState } from "react";
import OrderButton from "../../components/buttons/OrderButton";
import { Text, StyleSheet, View, Button } from "react-native";
import TriangleBackground from "../../components/TriangleBackground";
import { productButtons, ProductButton } from "../../types/ProductButtons";
import ItemCard from "../../components/cards/ItemCard";
import { useTranslation } from "react-i18next";
import { TranslationKeys } from "../../types/translation-keys";
import FirestoreManager from "../../services/FirestoreManager";
import { Order, OrderLocation } from "../../types/Order";
import { auth } from "../../services/Firebase";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/RootStackParamList";

export default function OrderMenu({
  route,
  navigation,
}: {
  route: RouteProp<RootStackParamList, "OrderMenu">;
  navigation: any;
}) {
  const userLocation: OrderLocation = route.params;

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

    if (user != null) {
      const order = new Order(user.uid, item, userLocation);
      await order.locSearch(); // This is to call the Nominatim API to define the user location name
      firestoreManager.writeData("orders", order);
      navigation.navigate("OrderPlaced", { orderId: order.getId() });
    } else {
      console.error("Could not find user.");
    }
  };

  return (
    <View style={styles.container} testID="order-menu-screen">
      <TriangleBackground />
      <Text style={styles.text} testID="order-menu-text">
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    //justifyContent: "flex-start",
    paddingTop: 160,
  },
  text: {
    fontSize: 36,
    marginBottom: 33,
    lineHeight: 40,
    alignSelf: "center",
  },
});
