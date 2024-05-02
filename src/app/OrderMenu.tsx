import React, { useState } from "react";
import OrderButton from "../components/OrderButton";
import { Text, StyleSheet, View } from "react-native";
import TriangleBackground from "../components/TriangleBackground";
import { productButtons } from "../types/ProductButtons";
import ItemCard from "../components/ItemCard";

interface OrderProps {
  // Define your component props here
  // will pass location and maybe user info here
}

export default function OrderMenu({ navigation }: any) {
  const [visibleItemId, setVisibleItemId] = useState<number | null>(null);

  const handleOpenCard = (itemId: number) => {
    setVisibleItemId(itemId);
  };

  const handleCloseCard = () => {
    setVisibleItemId(null);
  };

  return (
    <View style={styles.container} testID="order-menu-screen">
      <TriangleBackground />
      <Text style={styles.text} testID="order-menu-text">
        Choose your item
      </Text>
      {productButtons.map((button) => (
        <OrderButton
          title={button.item.getName()}
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
            handleOrder={() =>
              navigation.navigate("OrderPlaced", {
                orderedItem: button.item,
                placedAt: Date.now(),
                userLocation: "1234 Main St",
              })
            }
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
